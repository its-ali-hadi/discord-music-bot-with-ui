import { Router } from 'express';
import { config } from '../config.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'YouTube Player Control',
    defaultGuildId: config.guildId || '',
    defaultVoiceChannelId: config.defaultVoiceChannelId || '',
  });
});

router.get('/nowplaying', (req, res) => {
  res.render('nowplaying', { title: 'Now Playing' });
});

export default router;