const commentModel =
require("../../models/comments/commentModel");

const eventDispatcher =
require("../../realtime/EventDispatcher");

const updateCommentController = async (req, res) => {

    try {

        const { commentId } = req.params;

        const {

            user_id,
            comment,

        } = req.body;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (

            !commentId ||

            !user_id ||

            !comment ||

            comment.trim() === ""

        ) {

            return res.status(400).json({

                success: false,

                error:
                "commentId, user_id and comment are required",

            });

        }

        //////////////////////////////////////////////////////
        // FIND COMMENT
        //////////////////////////////////////////////////////

        const existingComment =

            await commentModel.getComment(

                commentId,

            );

        if (!existingComment) {

            return res.status(404).json({

                success: false,

                error: "Comment not found",

            });

        }

        //////////////////////////////////////////////////////
        // OWNER ONLY
        //////////////////////////////////////////////////////

        if (

            Number(existingComment.user_id) !==

            Number(user_id)

        ) {

            return res.status(403).json({

                success: false,

                error:
                "You are not allowed to edit this comment",

            });

        }

        //////////////////////////////////////////////////////
        // UPDATE COMMENT
        //////////////////////////////////////////////////////

        const updatedComment =

            await commentModel.updateComment(

                commentId,

                comment.trim(),

            );

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.postComment({

            action: "updated",

            postId:
            Number(existingComment.post_id),

            commentId:
            Number(commentId),

            comment:
            updatedComment,

            viewers: [],

        });

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            comment:
            updatedComment,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error: error.message,

        });

    }

};

module.exports =
updateCommentController;