import { getGuildPlayer } from '../services/discordPlayer.js';
import { getInfo } from '../services/youtubeService.js';

export async function playHandler(req, res) {
  try {
    const { voiceChannelId, urlOrQuery } = req.body;
    const guildId = '1114338679780028449'
    if (!guildId || !voiceChannelId || !urlOrQuery) {
      return res.status(400).json({ error: 'guildId, voiceChannelId, urlOrQuery are required' });
    }

    const player = getGuildPlayer(guildId);
    await player.connect(voiceChannelId, req.app.get('adapterCreator')(guildId));

    // If the user passed a full URL, use it; else treat as query and get info
    const meta = await getInfo(urlOrQuery);
    const result = await player.play(meta);
    return res.json({ ok: true, result, nowPlaying: player.nowPlaying(), status: player.status() });
  } catch (e) {
    console.error("Play error:", e);

    return res.status(500).json({ error: e.message });
  }
}

export function pauseHandler(req, res) {
  try {
    const { guildId } = req.body;
    const player = getGuildPlayer(guildId);
    player.pause();
    return res.json({ ok: true, status: player.status() });
  } catch (e) {
    console.error("Play error:", e);

    return res.status(500).json({ error: e.message });
  }
}

export function resumeHandler(req, res) {
  try {
    const { guildId } = req.body;
    const player = getGuildPlayer(guildId);
    player.resume();
    return res.json({ ok: true, status: player.status() });
  } catch (e) {
    console.error("Play error:", e);

    return res.status(500).json({ error: e.message });
  }
}

export function stopHandler(req, res) {
  try {
    const { guildId } = req.body;
    const player = getGuildPlayer(guildId);
    player.stop();
    return res.json({ ok: true, status: player.status() });
  } catch (e) {
    console.error("Play error:", e);

    return res.status(500).json({ error: e.message });
  }
}

export function statusHandler(req, res) {
  try {
    const { guildId } = req.query;
    const player = getGuildPlayer(guildId);
    return res.json({ ok: true, status: player?.status() || null });
  } catch (e) {
    console.error("Play error:", e);

    return res.status(500).json({ error: e.message });
  }
}