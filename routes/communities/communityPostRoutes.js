const express = require('express');

const router = express.Router();

const createCommunityPost =
require('../../controllers/communities/posts/createCommunityPostController');

const getCommunityPosts =
require('../../controllers/communities/posts/getCommunityPostsController');

const updateCommunityPost =
require('../../controllers/communities/posts/updateCommunityPostController');

const deleteCommunityPost =
require('../../controllers/communities/posts/deleteCommunityPostController');

const likeCommunityPost =
require('../../controllers/communities/posts/likeCommunityPostController');

const unlikeCommunityPost =
require('../../controllers/communities/posts/unlikeCommunityPostController');

const commentCommunityPost =
require('../../controllers/communities/posts/commentCommunityPostController');

const getCommunityComments =
require('../../controllers/communities/getCommunityCommentsController');

// Posts
router.post('/', createCommunityPost);

router.get('/:community_id', getCommunityPosts);

router.put('/:id', updateCommunityPost);

router.delete('/:id', deleteCommunityPost);

// Likes
router.post('/like', likeCommunityPost);

router.delete('/unlike', unlikeCommunityPost);

// Comments
router.post('/comment', commentCommunityPost);

router.get('/comments/:post_id', getCommunityComments);

module.exports = router;