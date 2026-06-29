const express = require('express');
const router = express.Router();

const uploadChannelFile =
require('../../controllers/channels/files/uploadChannelFileController');

const getChannelFiles =
require('../../controllers/channels/files/getChannelFilesController');

const deleteChannelFile =
require('../../controllers/channels/files/deleteChannelFileController');

router.post('/', uploadChannelFile);

router.get('/:post_id', getChannelFiles);

router.delete('/:id', deleteChannelFile);

module.exports = router;