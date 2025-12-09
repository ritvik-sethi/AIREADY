import { Router } from 'express';
import { db } from '../../db/config';
import { mockTests } from '../../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all mock tests
router.get('/', async (req, res) => {
  try {
    const allMockTests = await db.select().from(mockTests);
    res.json(allMockTests);
  } catch (error) {
    console.error('Error fetching mock tests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mock test by ID
router.get('/:testId', async (req, res) => {
  try {
    const testId = req.params.testId;
    const result = await db.select().from(mockTests).where(eq(mockTests.id, testId)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Mock test not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching mock test by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new mock test
router.post('/', async (req, res) => {
  try {
    const { id, title, description, duration, totalQuestions, passingScore, questions } = req.body;

    if (!id || !title || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: id, title, and questions are required' });
    }

    const newTest = {
      id,
      title,
      description: description || null,
      duration: duration || 60,
      totalQuestions: totalQuestions || questions.length,
      passingScore: passingScore || 70,
      questions: questions || [],
    };

    await db.insert(mockTests).values(newTest);

    res.status(201).json(newTest);
  } catch (error: any) {
    console.error('Error creating mock test:', error);
    if (error.code === '23505') {
      // PostgreSQL unique violation
      return res.status(409).json({ error: 'Mock test with this ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update mock test
router.put('/:testId', async (req, res) => {
  try {
    const testId = req.params.testId;
    const { title, description, duration, totalQuestions, passingScore, questions } = req.body;

    // Check if test exists
    const existingTest = await db.select().from(mockTests).where(eq(mockTests.id, testId)).limit(1);
    if (existingTest.length === 0) {
      return res.status(404).json({ error: 'Mock test not found' });
    }

    const updatedTest = {
      title: title || existingTest[0].title,
      description: description !== undefined ? description : existingTest[0].description,
      duration: duration !== undefined ? duration : existingTest[0].duration,
      totalQuestions: totalQuestions !== undefined ? totalQuestions : existingTest[0].totalQuestions,
      passingScore: passingScore !== undefined ? passingScore : existingTest[0].passingScore,
      questions: questions || existingTest[0].questions,
      updatedAt: new Date(),
    };

    await db.update(mockTests)
      .set(updatedTest)
      .where(eq(mockTests.id, testId));

    const result = await db.select().from(mockTests).where(eq(mockTests.id, testId)).limit(1);
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating mock test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete mock test
router.delete('/:testId', async (req, res) => {
  try {
    const testId = req.params.testId;

    // Check if test exists
    const existingTest = await db.select().from(mockTests).where(eq(mockTests.id, testId)).limit(1);
    if (existingTest.length === 0) {
      return res.status(404).json({ error: 'Mock test not found' });
    }

    await db.delete(mockTests).where(eq(mockTests.id, testId));

    res.json({ message: 'Mock test deleted successfully' });
  } catch (error) {
    console.error('Error deleting mock test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
