const express = require("express");

const router = express.Router();

const createMessage =
require("../../controllers/messages/createMessageController");

const createMediaMessage =
require("../../controllers/messages/createMediaMessageController");

const getMessages =
require("../../controllers/messages/getMessagesController");

const markDelivered =
require("../../controllers/messages/markDeliveredController");

const markSeen =
require("../../controllers/messages/markSeenController");

const deleteMessage =
require("../../controllers/messages/deleteMessageController");

//////////////////////////////////////////////////////
// TEXT MESSAGE
//////////////////////////////////////////////////////

router.post(
  "/send",
  createMessage,
);

//////////////////////////////////////////////////////
// MEDIA MESSAGE
//////////////////////////////////////////////////////

router.post(
  "/send-media",
  createMediaMessage,
);

//////////////////////////////////////////////////////
// DELIVERED
//////////////////////////////////////////////////////

router.post(
  "/delivered",
  markDelivered,
);

//////////////////////////////////////////////////////
// SEEN
//////////////////////////////////////////////////////

router.post(
  "/seen",
  markSeen,
);

//////////////////////////////////////////////////////
// GET MESSAGES
//////////////////////////////////////////////////////

router.get(
  "/:chat_id",
  getMessages,
);

//////////////////////////////////////////////////////
// DELETE MESSAGE
//////////////////////////////////////////////////////

router.delete(
  "/delete/:messageId",
  deleteMessage,
);

module.exports = router;