const express = require('express');

const router = express.Router();

/// Broadcast
const createBroadcast =
require('../../controllers/broadcasts/createBroadcastController');

const getBroadcasts =
require('../../controllers/broadcasts/getBroadcastsController');

const getBroadcast =
require('../../controllers/broadcasts/getBroadcastController');

const updateBroadcast =
require('../../controllers/broadcasts/updateBroadcastController');

const deleteBroadcast =
require('../../controllers/broadcasts/deleteBroadcastController');

/// Members
const addBroadcastMembers =
require('../../controllers/broadcasts/addBroadcastMembersController');

const removeBroadcastMember =
require('../../controllers/broadcasts/removeBroadcastMemberController');

const getBroadcastMembers =
require('../../controllers/broadcasts/getBroadcastMembersController');

/// Messages
const sendBroadcastMessage =
require('../../controllers/broadcasts/sendBroadcastMessageController');

const getBroadcastMessages =
require('../../controllers/broadcasts/getBroadcastMessagesController');

const searchBroadcastMessages =
require('../../controllers/broadcasts/searchBroadcastMessagesController');

const editBroadcastMessage =
require('../../controllers/broadcasts/editBroadcastMessageController');

const deleteBroadcastMessage =
require('../../controllers/broadcasts/deleteBroadcastMessageController');

const markBroadcastMessageRead =
require('../../controllers/broadcasts/markBroadcastMessageReadController');

/// Media
const uploadBroadcastMedia =
require('../../controllers/broadcasts/uploadBroadcastMediaController');

const getBroadcastMedia =
require('../../controllers/broadcasts/getBroadcastMediaController');

/// Files
const uploadBroadcastFile =
require('../../controllers/broadcasts/uploadBroadcastFileController');

const getBroadcastFiles =
require('../../controllers/broadcasts/getBroadcastFilesController');

/// Links
const getBroadcastLinks =
require('../../controllers/broadcasts/getBroadcastLinksController');

/// Wallpaper
const saveBroadcastWallpaper =
require('../../controllers/broadcasts/saveBroadcastWallpaperController');

const getBroadcastWallpaper =
require('../../controllers/broadcasts/getBroadcastWallpaperController');

/// Notifications
const saveBroadcastNotificationSettings =
require('../../controllers/broadcasts/saveBroadcastNotificationSettingsController');

const getBroadcastNotificationSettings =
require('../../controllers/broadcasts/getBroadcastNotificationSettingsController');

/// Storage
const getBroadcastStorage =
require('../../controllers/broadcasts/getBroadcastStorageController');

/// Reactions
const addBroadcastReaction =
require('../../controllers/broadcasts/addBroadcastReactionController');

const removeBroadcastReaction =
require('../../controllers/broadcasts/removeBroadcastReactionController');

//////////////////////////////////////////////////////////
// BROADCAST
//////////////////////////////////////////////////////////

router.post(
  '/',
  createBroadcast,
);

router.get(
  '/user/:userId',
  getBroadcasts,
);

router.get(
  '/:id',
  getBroadcast,
);

router.put(
  '/',
  updateBroadcast,
);

router.delete(
  '/:broadcastId',
  deleteBroadcast,
);

//////////////////////////////////////////////////////////
// MEMBERS
//////////////////////////////////////////////////////////

router.post(
  '/members',
  addBroadcastMembers,
);

router.delete(
  '/members',
  removeBroadcastMember,
);

router.get(
  '/members/:broadcastId',
  getBroadcastMembers,
);

//////////////////////////////////////////////////////////
// MESSAGES
//////////////////////////////////////////////////////////

router.post(
  '/messages',
  sendBroadcastMessage,
);

router.get(
  '/messages/:broadcastId',
  getBroadcastMessages,
);

router.get(
  '/messages/search',
  searchBroadcastMessages,
);

router.put(
  '/messages',
  editBroadcastMessage,
);

router.delete(
  '/messages',
  deleteBroadcastMessage,
);

router.put(
  '/messages/read',
  markBroadcastMessageRead,
);

//////////////////////////////////////////////////////////
// MEDIA
//////////////////////////////////////////////////////////

router.post(
  '/media',
  uploadBroadcastMedia,
);

router.get(
  '/media/:broadcastId',
  getBroadcastMedia,
);

//////////////////////////////////////////////////////////
// FILES
//////////////////////////////////////////////////////////

router.post(
  '/files',
  uploadBroadcastFile,
);

router.get(
  '/files/:broadcastId',
  getBroadcastFiles,
);

//////////////////////////////////////////////////////////
// LINKS
//////////////////////////////////////////////////////////

router.get(
  '/links/:broadcastId',
  getBroadcastLinks,
);

//////////////////////////////////////////////////////////
// WALLPAPER
//////////////////////////////////////////////////////////

router.post(
  '/wallpaper',
  saveBroadcastWallpaper,
);

router.get(
  '/wallpaper/:broadcastId/:userId',
  getBroadcastWallpaper,
);

//////////////////////////////////////////////////////////
// NOTIFICATIONS
//////////////////////////////////////////////////////////

router.post(
  '/notifications',
  saveBroadcastNotificationSettings,
);

router.get(
  '/notifications/:broadcastId/:userId',
  getBroadcastNotificationSettings,
);

//////////////////////////////////////////////////////////
// STORAGE
//////////////////////////////////////////////////////////

router.get(
  '/storage/:broadcastId',
  getBroadcastStorage,
);

//////////////////////////////////////////////////////////
// REACTIONS
//////////////////////////////////////////////////////////

router.post(
  '/reactions',
  addBroadcastReaction,
);

router.delete(
  '/reactions',
  removeBroadcastReaction,
);

module.exports = router;