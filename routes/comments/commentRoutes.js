const express = require('express');

const router = express.Router();

const createComment =
require('../../controllers/comments/createCommentController');

const getComments =
require('../../controllers/comments/getCommentsController');

router.post('/create', createComment);

router.get('/:post_id', getComments);

module.exports = router;