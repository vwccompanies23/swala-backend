const express = require('express');

const router = express.Router();

const createChat =
require('../../controllers/chats/createChatController');

const getUserChats =
require('../../controllers/chats/getUserChatsController');

// Create a chat
router.post(
  '/create',
  createChat,
);

// Get all chats for a user
router.get(
  '/user/:userId',
  getUserChats,
);

module.exports = router;