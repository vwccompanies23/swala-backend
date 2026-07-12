const express = require("express");

const router = express.Router();

const upload =
require("../../middleware/uploadPostMedia");

const createPost =
require("../../controllers/posts/createPostController");
const getPosts =
require("../../controllers/posts/getPostsController");
const viewPost =
require("../../controllers/posts/viewPostController");

const uploadPostMedia =
require("../../controllers/posts/uploadPostMediaController");
const deletePost =
require("../../controllers/posts/deletePostController");
const deleteExpiredPosts =
require("../../controllers/posts/deleteExpiredPostsController");
const getPostViewers =
require("../../controllers/posts/getPostViewersController");

//////////////////////////////////////////////////////
// UPLOAD POST MEDIA
//////////////////////////////////////////////////////

router.post(

    "/upload",

    (req, res, next) => {

        upload.single("media")(req, res, function (err) {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    success: false,

                    error: err.message,

                });

            }

            next();

        });

    },

    uploadPostMedia,

);

//////////////////////////////////////////////////////
// CREATE POST
//////////////////////////////////////////////////////

router.post(

    "/create",

    createPost,

);

//////////////////////////////////////////////////////
// GET POSTS
//////////////////////////////////////////////////////

router.get(

    "/",

    getPosts,

);
router.delete(
    "/delete/:postId",
    deletePost,
);

//////////////////////////////////////////////////////
// GET POST VIEWERS
//////////////////////////////////////////////////////

router.get(

    "/viewers/:postId",

    getPostViewers,

);
//////////////////////////////////////////////////////
// VIEW POST
//////////////////////////////////////////////////////

router.post(

    "/view",

    viewPost,

);

//////////////////////////////////////////////////////
// DELETE EXPIRED POSTS (MANUAL TEST)
//////////////////////////////////////////////////////

router.delete(

    "/cleanup",

    deleteExpiredPosts,

);

module.exports = router;