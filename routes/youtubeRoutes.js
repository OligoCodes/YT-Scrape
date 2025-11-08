const express = require('express');
const router = express.Router();
const controller = require('../controllers/youtubeController');

// Channels
router.get('/channels', controller.getChannel);
router.get('/channels/:id/videos', controller.getChannelVideos);
router.post('/channels/batch', controller.getChannelsBatch);

// Videos
router.get('/videos/:id', controller.getVideo);
router.get('/videos/:id/formats', controller.getVideoFormats);
router.post('/videos/batch', controller.getVideosBatch);
router.get('/videos/:id/preview', controller.getVideoPreview);

// Playlists
router.get('/playlists/:id', controller.getPlaylist);
router.get('/playlists/:id/videos', controller.getPlaylistVideos);

// Search & Trending
router.get('/search', controller.searchVideos);
router.get('/trending', controller.getTrendingVideos);

module.exports = router;
