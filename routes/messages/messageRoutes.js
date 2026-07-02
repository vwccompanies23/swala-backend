const express = require('express');

const router = express.Router();

const createMessage =
require('../../controllers/messages/createMessageController');

const getMessages =
require('../../controllers/messages/getMessagesController');

const markDelivered =
require('../../controllers/messages/markDeliveredController');

const markSeen =
require('../../controllers/messages/markSeenController');

router.post('/send', createMessage);

router.post('/delivered', markDelivered);

router.post('/seen', markSeen);

router.get('/:chat_id', getMessages);

module.exports = router;