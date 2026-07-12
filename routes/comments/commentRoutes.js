const express = require("express");

const router = express.Router();

const createCommentController =
require("../../controllers/comments/createCommentController");

const getCommentsController =
require("../../controllers/comments/getCommentsController");

const updateCommentController =
require("../../controllers/comments/updateCommentController");

const deleteCommentController =
require("../../controllers/comments/deleteCommentController");

const replyCommentController =
require("../../controllers/comments/replyCommentController");

const likeCommentController =
require("../../controllers/comments/likeCommentController");

//////////////////////////////////////////////////////
// CREATE COMMENT
//////////////////////////////////////////////////////

router.post(

    "/create",

    createCommentController,

);

//////////////////////////////////////////////////////
// GET COMMENTS
//////////////////////////////////////////////////////

router.get(

    "/:post_id",

    getCommentsController,

);

//////////////////////////////////////////////////////
// UPDATE COMMENT
//////////////////////////////////////////////////////

router.put(

    "/:commentId",

    updateCommentController,

);

//////////////////////////////////////////////////////
// DELETE COMMENT
//////////////////////////////////////////////////////

router.delete(

    "/:commentId",

    deleteCommentController,

);

//////////////////////////////////////////////////////
// REPLY TO COMMENT
//////////////////////////////////////////////////////

router.post(

    "/reply",

    replyCommentController,

);

//////////////////////////////////////////////////////
// LIKE COMMENT
//////////////////////////////////////////////////////

router.post(

    "/like",

    likeCommentController,

);

module.exports = router;