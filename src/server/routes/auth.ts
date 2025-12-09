import { Router } from 'express';
import { authenticateUser, getUserByEmail, checkUserExists, createUser, getUserCourseProgress, getUserMockTestResults } from '../controllers/authController';

const authRouter = Router();

// Check if user exists (by email or phone)
authRouter.post('/check-user', async (req, res) => {
  const { email, phone } = req.body;
  try {
    const result = await checkUserExists(email || null, phone || null);
    res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('🔴 [API] Backend check user error:', error);
    console.error('🔴 [API] Error stack:', error.stack);
    console.error('🔴 [API] Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Signup endpoint
authRouter.post('/signup', async (req, res) => {
  const { name, email, phone, password, address } = req.body;
  try {
    // Validate required fields
    if (!name || !password || !address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, password, and address are required' 
      });
    }

    if (!email && !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Either email or phone must be provided' 
      });
    }

    const user = await createUser({ name, email, phone, password, address });
    res.status(201).json({ success: true, user });
  } catch (error: any) {
    console.error('Backend signup error:', error);
    const message = error.message || 'Server error';
    const statusCode = message.includes('already exists') ? 409 : 500;
    res.status(statusCode).json({ success: false, message });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Email or phone is required' });
    }

    const user = await authenticateUser(email || null, phone || null, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Backend login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

authRouter.get('/user-by-email', async (req, res) => {
  const { email } = req.query;
  if (typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  try {
    const user = await getUserByEmail(email);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Backend get user by email error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user course progress
authRouter.get('/user/:userId/course-progress', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    const progress = await getUserCourseProgress(userId);
    res.json({ success: true, progress });
  } catch (error: any) {
    console.error('Error fetching user course progress:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get user mock test results
authRouter.get('/user/:userId/mock-tests', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    const results = await getUserMockTestResults(userId);
    res.json({ success: true, results });
  } catch (error: any) {
    console.error('Error fetching user mock test results:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default authRouter;
