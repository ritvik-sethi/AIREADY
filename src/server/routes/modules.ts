import { Router } from 'express';
import { db } from '../../db/config';
import { modules } from '../../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all modules
router.get('/', async (req, res) => {
  try {
    const allModules = await db.select().from(modules);
    res.json(allModules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get module by ID
router.get('/:moduleId', async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const result = await db.select().from(modules).where(eq(modules.id, moduleId)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching module by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
