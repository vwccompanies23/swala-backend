const express = require('express');
const router = express.Router();

const createChannel = require('../../controllers/channels/createChannelController');
const getChannels = require('../../controllers/channels/getChannelsController');
const getChannel = require('../../controllers/channels/getChannelController');
const updateChannel = require('../../controllers/channels/updateChannelController');
const deleteChannel = require('../../controllers/channels/deleteChannelController');
const followChannel = require('../../controllers/channels/followChannelController');
const unfollowChannel = require('../../controllers/channels/unfollowChannelController');
const searchChannels = require('../../controllers/channels/searchChannelsController');

// Channels
router.post('/', createChannel);
router.get('/', getChannels);

// Search
router.get('/search', searchChannels);

// Follow
router.post('/follow', followChannel);
router.delete('/unfollow', unfollowChannel);

// Single channel
router.get('/:id', getChannel);
router.put('/:id', updateChannel);
router.delete('/:id', deleteChannel);

module.exports = router;