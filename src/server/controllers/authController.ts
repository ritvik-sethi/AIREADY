import { users, courseProgress, mockTestResults } from '../../db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Lazy load db to avoid top-level await issues
async function getDb() {
  const { db } = await import('../../db/config');
  return db;
}

// Internal function to get user by email with password for authentication
async function _getUserByEmailWithPassword(email: string) {
  try {
    const db = await getDb();
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (result.length === 0) return null;
    return result[0];
  } catch (error) {
    console.error('Error fetching user by email with password:', error);
    throw error;
  }
}

export async function authenticateUser(email: string | null, phone: string | null, password: string) {
  try {
    let user;
    let identifierUsed: 'email' | 'phone' | null = null;
    
    if (email) {
      user = await _getUserByEmailWithPassword(email);
      identifierUsed = 'email';
    } else if (phone) {
      // Get user by phone
      const db = await getDb();
      const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
      if (result.length === 0) return null;
      user = result[0];
      identifierUsed = 'phone';
    } else {
      return null;
    }

    if (!user) return null;
    
    // Check if user has a primary identifier set
    // If primary identifier is set, only allow login with that identifier
    if (user.primaryIdentifier) {
      if (user.primaryIdentifier !== identifierUsed) {
        // User is trying to login with non-primary identifier
        return null;
      }
    }
    
    // Use bcrypt to compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // If this is the first login (primaryIdentifier is null), set it based on what was used
      if (!user.primaryIdentifier && identifierUsed) {
        const db = await getDb();
        await db.update(users)
          .set({ 
            primaryIdentifier: identifierUsed,
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id));
        
        // Update user object
        user.primaryIdentifier = identifierUsed;
      }
      
      // Successfully authenticated, now return user *without* password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

// Check if user exists by email or phone
export async function checkUserExists(email: string | null, phone: string | null) {
  try {
    if (!email && !phone) {
      return { exists: false, message: 'Email or phone is required', primaryIdentifier: null };
    }

    // Determine identifier for external API call (prefer email)
    const identifier = email || phone;
    if (!identifier) {
      return { exists: false, primaryIdentifier: null };
    }

    // Check local database first
    const db = await getDb();
    let dbResult: any[] = [];
    if (email && phone) {
      // Check both email and phone
      dbResult = await db.select().from(users).where(
        or(eq(users.email, email), eq(users.phone, phone))
      ).limit(1);
    } else if (email) {
      // Check only email (phone is null or empty)
      dbResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    } else if (phone) {
      // Check only phone (email is null or empty)
      dbResult = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    } else {
      dbResult = [];
    }

    const userExistsInDb = dbResult.length > 0;

    // Call external API to check user existence
    try {
      const externalApiResponse = await fetch('https://jssostg.indiatimes.com/sso/crossapp/identity/web/checkUserExists', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'channel': 'epaperet',
          'content-type': 'application/json',
          'isjssocrosswalk': 'true',
          'origin': 'https://dev-buy.indiatimes.com',
          'platform': 'web',
          'referer': 'https://dev-buy.indiatimes.com/',
          'sdkversion': '0.8.1',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
        },
        body: JSON.stringify({ identifier })
      });
      
      const externalApiData = await externalApiResponse.json();
      
      const statusCode = externalApiData?.data?.statusCode || externalApiData?.statusCode;

      // Logic: 
      // - If statusCode === 213 OR user exists in DB → show login (exists: true)
      // - If statusCode === 215 AND user does not exist in DB → show signup (exists: false)
      
      if (statusCode === 213 || userExistsInDb) {
        // User exists - show login
        if (userExistsInDb && dbResult.length > 0) {
          const user = dbResult[0];
          // Return primary identifier if set, otherwise return both
          const primaryIdentifier = user.primaryIdentifier || null;
          
          return { 
            exists: true, 
            hasEmail: !!user.email,
            hasPhone: !!user.phone,
            email: user.email || null,
            phone: user.phone || null,
            primaryIdentifier: primaryIdentifier, // 'email', 'phone', or null
            jssoApiCalled: true,
            jssoStatusCode: statusCode
          };
        }
        return { 
          exists: true, 
          primaryIdentifier: null, // Not in DB yet, so no primary identifier
          jssoApiCalled: true, 
          jssoStatusCode: statusCode 
        };
      } else if (statusCode === 215 && !userExistsInDb) {
        // User doesn't exist in external system and not in DB - show signup
        return { 
          exists: false, 
          primaryIdentifier: null,
          jssoApiCalled: true, 
          jssoStatusCode: statusCode 
        };
      } else {
        // Fallback: use DB check result
        if (userExistsInDb && dbResult.length > 0) {
          const user = dbResult[0];
          const primaryIdentifier = user.primaryIdentifier || null;
          
          return { 
            exists: true, 
            hasEmail: !!user.email,
            hasPhone: !!user.phone,
            email: user.email || null,
            phone: user.phone || null,
            primaryIdentifier: primaryIdentifier,
            jssoApiCalled: true,
            jssoStatusCode: statusCode
          };
        }
        return { 
          exists: false, 
          primaryIdentifier: null,
          jssoApiCalled: true, 
          jssoStatusCode: statusCode 
        };
      }
    } catch (externalApiError: any) {
      console.error('❌ Error calling JSSO external API:', externalApiError);
      console.error('❌ Error message:', externalApiError?.message);
      console.error('❌ Error stack:', externalApiError?.stack);
      // Fallback to DB check if external API fails
      if (userExistsInDb && dbResult.length > 0) {
        const user = dbResult[0];
        const primaryIdentifier = user.primaryIdentifier || null;
        
        return { 
          exists: true, 
          hasEmail: !!user.email,
          hasPhone: !!user.phone,
          email: user.email || null,
          phone: user.phone || null,
          primaryIdentifier: primaryIdentifier,
          jssoApiCalled: false,
          jssoError: externalApiError?.message || 'Unknown error'
        };
      }
      return { 
        exists: false, 
        primaryIdentifier: null,
        jssoApiCalled: false, 
        jssoError: externalApiError?.message || 'Unknown error' 
      };
    }
  } catch (error: any) {
    console.error('Error checking user existence:', error);
    console.error('Error details:', error.message, error.stack);
    throw error;
  }
}

// Create new user (signup)
export async function createUser(userData: {
  name: string;
  email?: string | null;
  phone?: string | null;
  password: string;
  address: string;
  role?: string;
}) {
  try {
    // Validate that at least email or phone is provided
    if (!userData.email && !userData.phone) {
      throw new Error('Either email or phone must be provided');
    }

    // Check if user already exists
    const existingUser = await checkUserExists(userData.email || null, userData.phone || null);
    if (existingUser.exists) {
      throw new Error('User with this email or phone already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Insert user
    const db = await getDb();
    const result = await db.insert(users).values({
      name: userData.name,
      email: userData.email || null,
      phone: userData.phone || null,
      password: hashedPassword,
      address: userData.address, // Using address field
      location: userData.address, // Also set location for compatibility
      role: userData.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Remove password before returning
    const { password: _, ...userWithoutPassword } = result[0];
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const db = await getDb();
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (result.length === 0) return null;

    const user = result[0];
    // Remove password before returning to frontend
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

export async function getUserCourseProgress(userId: number) {
  try {
    const db = await getDb();
    const progress = await db.select().from(courseProgress).where(eq(courseProgress.userId, userId));
    return progress;
  } catch (error) {
    console.error('Error fetching course progress from controller:', error);
    throw error;
  }
}

export async function getUserMockTestResults(userId: number) {
  try {
    const db = await getDb();
    const results = await db.select().from(mockTestResults).where(eq(mockTestResults.userId, userId));
    return results;
  } catch (error) {
    console.error('Error fetching mock test results from controller:', error);
    throw error;
  }
}
