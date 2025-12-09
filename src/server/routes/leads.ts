import { Router } from 'express';
import { db } from '../../db/config';
import { leads } from '../../db/schema';
import { eq, sql, or, like } from 'drizzle-orm';

const router = Router();

// Get all leads
router.get('/', async (req, res) => {
  try {
    const allLeads = await db.select().from(leads).orderBy(sql`${leads.createdAt} DESC`);
    res.json(allLeads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lead by ID
router.get('/:leadId', async (req, res) => {
  try {
    const leadId = parseInt(req.params.leadId);
    const result = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching lead by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new lead
router.post('/', async (req, res) => {
  try {
    const leadData = req.body;
    const result = await db.insert(leads).values({
      ...leadData,
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update lead by ID
router.put('/:leadId', async (req, res) => {
  try {
    const leadId = parseInt(req.params.leadId);
    const updates = req.body;

    const result = await db.update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, leadId))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update lead status
router.put('/:leadId/status', async (req, res) => {
  try {
    const leadId = parseInt(req.params.leadId);
    const { status, updatedBy } = req.body;

    // Get current lead to update notes
    const currentLeadResult = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    if (currentLeadResult.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    const currentLead = currentLeadResult[0];

    const newNote = `Status changed to "${status}" by ${updatedBy} on ${new Date().toLocaleString()}`;
    const updatedNotes = [...((currentLead.notes || []) as string[]), newNote];

    const result = await db.update(leads)
      .set({
        status,
        notes: updatedNotes,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId))
      .returning();

    res.json(result[0]);
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add lead note
router.post('/:leadId/notes', async (req, res) => {
  try {
    const leadId = parseInt(req.params.leadId);
    const { note, createdBy } = req.body;

    // Get current lead to update notes
    const currentLeadResult = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    if (currentLeadResult.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    const currentLead = currentLeadResult[0];

    const noteText = `[${new Date().toLocaleString()}] ${createdBy}: ${note}`;
    const updatedNotes = [...((currentLead.notes || []) as string[]), noteText];

    const result = await db.update(leads)
      .set({
        notes: updatedNotes,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId))
      .returning();

    res.json(result[0]);
  } catch (error) {
    console.error('Error adding lead note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete lead by ID
router.delete('/:leadId', async (req, res) => {
  try {
    const leadId = parseInt(req.params.leadId);
    const result = await db.delete(leads).where(eq(leads.id, leadId)).returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search leads
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const lowerQuery = `%${query.toLowerCase()}%`;
    const results = await db.select()
      .from(leads)
      .where(
        or(
          like(sql`LOWER(${leads.name})`, lowerQuery),
          like(sql`LOWER(${leads.email})`, lowerQuery),
          like(sql`LOWER(${leads.organization})`, lowerQuery),
          like(leads.phone, `%${query}%`)
        )
      )
      .orderBy(sql`${leads.createdAt} DESC`);
    res.json(results);
  } catch (error) {
    console.error('Error searching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get lead stats
router.get('/stats', async (req, res) => {
  try {
    const allLeads = await db.select().from(leads);
    const stats = {
      total: allLeads.length,
      new: allLeads.filter(l => l.status === 'new').length,
      contacted: allLeads.filter(l => l.status === 'contacted').length,
      qualified: allLeads.filter(l => l.status === 'qualified').length,
      negotiation: allLeads.filter(l => l.status === 'negotiation').length,
      converted: allLeads.filter(l => l.status === 'converted').length,
      lost: allLeads.filter(l => l.status === 'lost').length,
      byType: {
        university: allLeads.filter(l => l.type === 'university').length,
        school: allLeads.filter(l => l.type === 'school').length,
        organization: allLeads.filter(l => l.type === 'organization').length,
      }
    };
    res.json(stats);
  } catch (error) {
    console.error('Error getting lead stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
