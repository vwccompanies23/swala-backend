const express = require("express");

const router = express.Router();

const createComment =
require("../../controllers/comments/createCommentController");

const getComments =
require("../../controllers/comments/getCommentsController");

const deleteComment =
require("../../controllers/comments/deleteCommentController");

//////////////////////////////////////////////////////
// CREATE COMMENT
//////////////////////////////////////////////////////

router.post(

    "/create",

    createComment,

);

//////////////////////////////////////////////////////
// GET COMMENTS
//////////////////////////////////////////////////////

router.get(

    "/:post_id",

    getComments,

);

//////////////////////////////////////////////////////
// DELETE COMMENT
//////////////////////////////////////////////////////

router.delete(

    "/:commentId",

    deleteComment,

);

module.exports = router;