const express = require('express');

const router = express.Router();

const createMessage =
require('../../controllers/messages/createMessageController');

const getMessages =
require('../../controllers/messages/getMessagesController');

router.post('/send', createMessage);

router.get('/:chat_id', getMessages);

module.exports = router;