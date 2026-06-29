const express = require('express');
const router = express.Router();

const createChannelPost =
require('../../controllers/channels/posts/createChannelPostController');

const getChannelPosts =
require('../../controllers/channels/posts/getChannelPostsController');

const updateChannelPost =
require('../../controllers/channels/posts/updateChannelPostController');

const deleteChannelPost =
require('../../controllers/channels/posts/deleteChannelPostController');

const likeChannelPost =
require('../../controllers/channels/posts/likeChannelPostController');

const unlikeChannelPost =
require('../../controllers/channels/posts/unlikeChannelPostController');

const commentChannelPost =
require('../../controllers/channels/posts/commentChannelPostController');

const getChannelComments =
require('../../controllers/channels/getChannelCommentsController');

// Create
router.post('/', createChannelPost);

// Comments
router.get('/comments/:post_id', getChannelComments);
router.post('/comment', commentChannelPost);

// Likes
router.post('/like', likeChannelPost);
router.delete('/unlike', unlikeChannelPost);

// Posts
router.get('/:channel_id', getChannelPosts);
router.put('/:id', updateChannelPost);
router.delete('/:id', deleteChannelPost);

module.exports = router;