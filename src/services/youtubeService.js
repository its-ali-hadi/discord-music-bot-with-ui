import { google } from 'googleapis';
import ytdl from 'ytdl-core';
import youtubedl from 'youtube-dl-exec';
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});
export async function searchYouTube(query, limit = 10) {
  const res = await youtube.search.list({
    part: 'snippet',
    q: query,
    maxResults: limit,
    type: 'video',
  });

  return res.data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    durationInSec: null,
    duration: null,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    thumbnail: item.snippet.thumbnails?.default?.url || null,
    channel: item.snippet.channelTitle || '',
  }));
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s]
    .map(v => String(v).padStart(2, '0'))
    .join(':')
    .replace(/^00:/, '');
}

export async function getInfo(videoIdOrUrl) {
  let videoId = videoIdOrUrl;
  if (videoIdOrUrl.includes('youtube.com')) {
    const urlObj = new URL(videoIdOrUrl);
    videoId = urlObj.searchParams.get('v');
  }

  const res = await youtube.videos.list({
    part: 'snippet,contentDetails',
    id: videoId,
  });

  if (!res.data.items.length) throw new Error('Video not found');
  const v = res.data.items[0];
  const durationISO = v.contentDetails.duration;
  const durationSec = isoDurationToSeconds(durationISO);

  return {
    id: videoId,
    title: v.snippet.title,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    durationInSec: durationSec,
    duration: formatDuration(durationSec),
    thumbnail: v.snippet.thumbnails?.default?.url || null,
    channel: v.snippet.channelTitle || '',
  };
}

function isoDurationToSeconds(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export async function streamFromUrl(url) {
  const result = await youtubedl(url, {
    dumpSingleJson: true,
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    format: 'bestaudio',
  });

  const audioUrl = result.url;
  return { stream: audioUrl, type: 'arbitrary' };
}
