import { Router } from 'express';
import { db } from '../../db/config';
import { certificationTracks } from '../../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all active certification tracks
router.get('/', async (req, res) => {
  try {
    const tracks = await db.select().from(certificationTracks).where(eq(certificationTracks.active, true));
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching certification tracks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get certification track by ID
router.get('/:trackId', async (req, res) => {
  try {
    const trackId = req.params.trackId;
    const result = await db.select().from(certificationTracks).where(eq(certificationTracks.id, trackId)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Certification track not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching certification track by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
