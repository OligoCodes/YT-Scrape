require('dotenv').config();
const axios = require('axios');
const { Innertube } = require('youtubei.js');

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) throw new Error('YOUTUBE_API_KEY is not set in .env');

const YT_BASE = 'https://www.googleapis.com/youtube/v3';

// cache Innertube client to avoid re-creating on every request
let _ytClient = null;
async function getYtClient() {
  if (_ytClient) return _ytClient;
  _ytClient = await Innertube.create();
  return _ytClient;
}

/* -------------------------------
   Generic YouTube v3 caller
--------------------------------- */
async function callYoutube(path, params = {}) {
  const url = `${YT_BASE}/${path}`;
  const response = await axios.get(url, { params: { key: API_KEY, ...params } });
  return response.data;
}

/* -------------------------------
   Channels
--------------------------------- */
async function getChannelByIdOrUsername(idOrName) {
  if (!idOrName) throw new Error('Missing channel id or name');

  // try id
  let data = await callYoutube('channels', {
    part: 'snippet,statistics,contentDetails',
    id: idOrName
  });
  if (data.items?.length) return normalizeChannel(data.items[0]);

  // try username
  data = await callYoutube('channels', {
    part: 'snippet,statistics,contentDetails',
    forUsername: idOrName
  });
  if (data.items?.length) return normalizeChannel(data.items[0]);

  // fallback search by title
  const search = await callYoutube('search', {
    part: 'snippet',
    q: idOrName,
    type: 'channel',
    maxResults: 1
  });
  if (search.items?.length) {
    const chId = search.items[0].snippet.channelId;
    const ch = await callYoutube('channels', {
      part: 'snippet,statistics,contentDetails',
      id: chId
    });
    if (ch.items?.length) return normalizeChannel(ch.items[0]);
  }

  const err = new Error('Channel not found');
  err.status = 404;
  throw err;
}

function normalizeChannel(item) {
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    profilePicture: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    subscribers: item.statistics?.subscriberCount || null,
    totalVideos: item.statistics?.videoCount || null,
    uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads || null
  };
}

async function getChannelsBatch(ids = []) {
  if (!Array.isArray(ids) || !ids.length) throw new Error('ids must be a non-empty array');
  const results = await Promise.all(ids.map(id => getChannelByIdOrUsername(id)));
  return results;
}

/* -------------------------------
   Channel videos (uploads playlist)
--------------------------------- */
async function getChannelVideos(idOrName, options = {}) {
  const channel = await getChannelByIdOrUsername(idOrName);
  if (!channel.uploadsPlaylistId) throw new Error('Uploads playlist not found');

  const params = {
    part: 'snippet,contentDetails',
    playlistId: channel.uploadsPlaylistId,
    maxResults: options.maxResults || 10
  };
  if (options.pageToken) params.pageToken = options.pageToken;

  const data = await callYoutube('playlistItems', params);

  const videos = data.items.map(i => ({
    id: i.contentDetails?.videoId,
    title: i.snippet?.title,
    description: i.snippet?.description,
    publishedAt: i.snippet?.publishedAt,
    thumbnails: i.snippet?.thumbnails
  }));

  return {
    channel,
    videos,
    nextPageToken: data.nextPageToken || null,
    prevPageToken: data.prevPageToken || null,
    pageInfo: data.pageInfo
  };
}

/* -------------------------------
   Videos
--------------------------------- */
async function getVideoById(videoId) {
  if (!videoId) throw new Error('Missing videoId');
  const yt = await getYtClient();
  const info = await yt.getInfo(videoId);

  return {
    id: info.basic_info.id,
    title: info.basic_info.title,
    description: info.basic_info.short_description,
    duration: info.basic_info.duration,
    viewCount: info.basic_info.view_count,
    channel: info.basic_info.author,
    thumbnails: info.basic_info.thumbnail,
    uploadDate: info.basic_info.upload_date
  };
}

async function getVideosBatch(ids = []) {
  if (!Array.isArray(ids) || !ids.length) throw new Error('ids must be a non-empty array');
  const results = await Promise.all(ids.map(id => getVideoById(id)));
  return results;
}

async function getVideoFormats(videoId) {
  const yt = await getYtClient();
  const info = await yt.getInfo(videoId);
  const allFormats = [...(info.streaming_data?.formats || []), ...(info.streaming_data?.adaptive_formats || [])];

  return allFormats.map(f => ({
    itag: f.itag,
    mimeType: f.mime_type,
    quality: f.quality_label || 'audio-only',
    bitrate: f.bitrate,
    url: f.deciphered_url || f.url || null
  }));
}

async function getVideoPreview(videoId, seconds = 30) {
  const yt = await getYtClient();
  const info = await yt.getInfo(videoId);
  // we only return metadata (not actual media). Generating a clipped stream is complex
  return {
    id: info.basic_info.id,
    title: info.basic_info.title,
    previewSeconds: seconds
  };
}

/* -------------------------------
   Playlists
--------------------------------- */
async function getPlaylistById(playlistId) {
  const data = await callYoutube('playlists', { part: 'snippet,contentDetails', id: playlistId });
  if (!data.items?.length) throw new Error('Playlist not found');
  const p = data.items[0];
  return {
    id: p.id,
    title: p.snippet.title,
    description: p.snippet.description,
    thumbnails: p.snippet.thumbnails,
    itemCount: p.contentDetails?.itemCount || 0
  };
}

async function getPlaylistVideos(playlistId, options = {}) {
  const params = {
    part: 'snippet,contentDetails',
    playlistId,
    maxResults: options.maxResults || 10
  };
  if (options.pageToken) params.pageToken = options.pageToken;

  const data = await callYoutube('playlistItems', params);

  const videos = data.items.map(i => ({
    id: i.contentDetails?.videoId,
    title: i.snippet?.title,
    description: i.snippet?.description,
    publishedAt: i.snippet?.publishedAt,
    thumbnails: i.snippet?.thumbnails
  }));

  return {
    videos,
    nextPageToken: data.nextPageToken || null,
    prevPageToken: data.prevPageToken || null,
    pageInfo: data.pageInfo
  };
}

/* -------------------------------
   Search & Trending
--------------------------------- */
async function searchVideos(query, maxResults = 10) {
  const data = await callYoutube('search', { part: 'snippet', q: query, type: 'video', maxResults });
  return data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    thumbnails: item.snippet.thumbnails
  }));
}

async function getTrendingVideos(regionCode = 'US', maxResults = 10) {
  const data = await callYoutube('videos', { part: 'snippet,statistics', chart: 'mostPopular', regionCode, maxResults });
  return data.items.map(item => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    viewCount: item.statistics.viewCount,
    thumbnails: item.snippet.thumbnails
  }));
}

/* -------------------------------
   Exports
--------------------------------- */
module.exports = {
  getChannelByIdOrUsername,
  getChannelsBatch,
  getChannelVideos,
  getVideoById,
  getVideosBatch,
  getVideoFormats,
  getVideoPreview,
  getPlaylistById,
  getPlaylistVideos,
  searchVideos,
  getTrendingVideos
};
