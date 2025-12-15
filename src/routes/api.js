import { Router } from 'express';
import { playHandler, pauseHandler, resumeHandler, stopHandler, statusHandler } from '../controllers/playerController.js';
import { searchYouTube } from '../services/youtubeService.js';

const router = Router();

// Search
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.status(400).json({ error: 'q is required' });
    const results = await searchYouTube(q, 10);
    res.json({ ok: true, results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Player control
router.post('/play', playHandler);
router.post('/pause', pauseHandler);
router.post('/resume', resumeHandler);
router.post('/stop', stopHandler);
router.get('/status', statusHandler);

export default router;