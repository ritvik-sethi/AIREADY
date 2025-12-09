import { Router } from 'express';
import { db } from '../../db/config';
import { roles, permissions } from '../../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all roles
router.get('/', async (req, res) => {
  try {
    const allRoles = await db.select().from(roles);
    res.json(allRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get role by ID
router.get('/:roleId', async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const result = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all permissions
router.get('/permissions', async (req, res) => {
  try {
    const allPermissions = await db.select().from(permissions);
    res.json(allPermissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
