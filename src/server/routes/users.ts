import { Router } from 'express';
import { db } from '../../db/config';
import { users, courseProgress, mockTestResults } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const router = Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const result = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user by ID
router.put('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const result = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user by ID
router.delete('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Delete related records first
    await db.delete(courseProgress).where(eq(courseProgress.userId, userId));
    await db.delete(mockTestResults).where(eq(mockTestResults.userId, userId));

    const result = await db.delete(users).where(eq(users.id, userId)).returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user course progress
router.get('/:userId/course-progress', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const progress = await db.select().from(courseProgress).where(eq(courseProgress.userId, userId));
    res.json(progress);
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user course progress
router.put('/:userId/course-progress/:moduleId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const moduleId = req.params.moduleId;
    const progressData = req.body;

    const existing = await db.select()
      .from(courseProgress)
      .where(and(
        eq(courseProgress.userId, userId),
        eq(courseProgress.moduleId, moduleId)
      ))
      .limit(1);

    let result;
    if (existing.length > 0) {
      result = await db.update(courseProgress)
        .set({
          progress: progressData.progress,
          status: progressData.status,
          overallProgress: progressData.overallProgress,
          updatedAt: new Date(),
        })
        .where(and(
          eq(courseProgress.userId, userId),
          eq(courseProgress.moduleId, moduleId)
        ))
        .returning();
    } else {
      result = await db.insert(courseProgress).values({
        userId,
        moduleId,
        progress: progressData.progress,
        status: progressData.status,
        overallProgress: progressData.overallProgress,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating course progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user mock test results
router.get('/:userId/mock-tests', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const results = await db.select().from(mockTestResults).where(eq(mockTestResults.userId, userId));
    res.json(results);
  } catch (error: any) {
    console.error('Error fetching mock test results:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Get specific user mock test result
router.get('/:userId/mock-tests/:testId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const testId = req.params.testId;
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const results = await db.select()
      .from(mockTestResults)
      .where(and(
        eq(mockTestResults.userId, userId),
        eq(mockTestResults.testId, testId)
      ))
      .limit(1);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Mock test result not found' });
    }
    
    res.json(results[0]);
  } catch (error: any) {
    console.error('Error fetching mock test result:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Save/Update user mock test result
router.put('/:userId/mock-tests/:testId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const testId = req.params.testId;
    const { score, completed, answers } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const existing = await db.select()
      .from(mockTestResults)
      .where(and(
        eq(mockTestResults.userId, userId),
        eq(mockTestResults.testId, testId)
      ))
      .limit(1);

    let result;
    if (existing.length > 0) {
      result = await db.update(mockTestResults)
        .set({
          score,
          completed,
          completedAt: completed ? new Date() : null,
          answers: answers || null,
          updatedAt: new Date(),
        })
        .where(and(
          eq(mockTestResults.userId, userId),
          eq(mockTestResults.testId, testId)
        ))
        .returning();
    } else {
      result = await db.insert(mockTestResults).values({
        userId,
        testId,
        score,
        completed,
        completedAt: completed ? new Date() : null,
        answers: answers || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
    }
    res.json(result[0]);
  } catch (error: any) {
    console.error('Error saving mock test result:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

export default router;
