import { Router } from 'express';
import { getDb } from '../../db/config';
import { roles, permissions } from '../../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all permissions (must come before /:roleId route)
router.get('/permissions', async (req, res) => {
  try {
    const db = await getDb();
    const allPermissions = await db.select().from(permissions);
    res.json(allPermissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
  }
});

// Get all roles
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const allRoles = await db.select().from(roles);
    res.json(allRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
  }
});

// Get role by ID (must come after /permissions route)
router.get('/:roleId', async (req, res) => {
  try {
    const db = await getDb();
    const roleId = req.params.roleId;
    const result = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
