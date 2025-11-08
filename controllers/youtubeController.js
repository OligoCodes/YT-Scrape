const YoutubeService = require('../services/youtubeService');

// -------------------- Channels --------------------
const getChannel = async (req, res, next) => {
  try {
    const idOrName = req.query.id || req.query.name;
    const data = await YoutubeService.getChannelByIdOrUsername(idOrName);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getChannelVideos = async (req, res, next) => {
  try {
    const idOrName = req.params.id || req.query.name;
    const maxResults = parseInt(req.query.maxResults) || 10;
    const pageToken = req.query.pageToken || null;
    const data = await YoutubeService.getChannelVideos(idOrName, { maxResults, pageToken });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getChannelsBatch = async (req, res, next) => {
  try {
    const { ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Provide body { ids: ["UCxxx", ...] }' });
    }
    const results = await YoutubeService.getChannelsBatch(ids);
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

// -------------------- Videos --------------------
const getVideo = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const data = await YoutubeService.getVideoById(videoId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getVideoFormats = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const data = await YoutubeService.getVideoFormats(videoId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getVideosBatch = async (req, res, next) => {
  try {
    const { ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Provide body { ids: ["dQw4...", ...] }' });
    }
    const results = await YoutubeService.getVideosBatch(ids);
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

const getVideoPreview = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const seconds = parseInt(req.query.seconds) || 30;
    const preview = await YoutubeService.getVideoPreview(videoId, seconds);
    res.json({ success: true, preview });
  } catch (err) {
    next(err);
  }
};

// -------------------- Playlists --------------------
const getPlaylist = async (req, res, next) => {
  try {
    const playlistId = req.params.id;
    const data = await YoutubeService.getPlaylistById(playlistId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getPlaylistVideos = async (req, res, next) => {
  try {
    const playlistId = req.params.id;
    const maxResults = parseInt(req.query.maxResults) || 10;
    const pageToken = req.query.pageToken || null;
    const data = await YoutubeService.getPlaylistVideos(playlistId, { maxResults, pageToken });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// -------------------- Search & Trending --------------------
const searchVideos = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ success: false, message: 'Missing ?q=search-term' });
    const maxResults = parseInt(req.query.maxResults) || 10;
    const data = await YoutubeService.searchVideos(query, maxResults);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getTrendingVideos = async (req, res, next) => {
  try {
    const region = req.query.region || 'US';
    const maxResults = parseInt(req.query.maxResults) || 10;
    const data = await YoutubeService.getTrendingVideos(region, maxResults);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getChannel,
  getChannelVideos,
  getChannelsBatch,
  getVideo,
  getVideoFormats,
  getVideosBatch,
  getVideoPreview,
  getPlaylist,
  getPlaylistVideos,
  searchVideos,
  getTrendingVideos
};
