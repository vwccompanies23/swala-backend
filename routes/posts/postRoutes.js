const express = require('express');

const router = express.Router();

const createPost =
require('../../controllers/posts/createPostController');

const getPosts =
require('../../controllers/posts/getPostsController');

router.post('/create', createPost);

router.get('/', getPosts);

module.exports = router;