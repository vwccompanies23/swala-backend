const express = require("express");

const router = express.Router();

const upload =
require("../../middleware/upload");

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

router.post(
  "/send",
  createMessage,
);

router.post(
  "/send-media",
  upload.single("file"),
  createMediaMessage,
);

router.post(
  "/delivered",
  markDelivered,
);

router.post(
  "/seen",
  markSeen,
);

router.get(
  "/:chat_id",
  getMessages,
);
router.delete(
  "/delete/:messageId",
  deleteMessage,
);

module.exports = router;