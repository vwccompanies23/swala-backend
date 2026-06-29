const express = require('express');

const router = express.Router();

const uploadCommunityFile =
require('../../controllers/communities/files/uploadCommunityFileController');

const getCommunityFiles =
require('../../controllers/communities/files/getCommunityFilesController');

const deleteCommunityFile =
require('../../controllers/communities/files/deleteCommunityFileController');

router.post('/', uploadCommunityFile);

router.get('/:post_id', getCommunityFiles);

router.delete('/:id', deleteCommunityFile);

module.exports = router;