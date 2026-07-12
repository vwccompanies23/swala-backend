const commentModel =
require("../../models/comments/commentModel");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const deleteCommentController = async (req, res) => {

    try {

        const { commentId } = req.params;

        const { user_id } = req.body;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (!commentId || !user_id) {

            return res.status(400).json({

                success: false,

                error: "commentId and user_id are required",

            });

        }

        //////////////////////////////////////////////////////
        // FIND COMMENT
        //////////////////////////////////////////////////////

        const comment =

            await commentModel.getComment(

                commentId,

            );

        if (!comment) {

            return res.status(404).json({

                success: false,

                error: "Comment not found",

            });

        }

        //////////////////////////////////////////////////////
        // OWNER ONLY
        //////////////////////////////////////////////////////

        if (

            Number(comment.user_id) !==

            Number(user_id)

        ) {

            return res.status(403).json({

                success: false,

                error:
                "You are not allowed to delete this comment",

            });

        }

        //////////////////////////////////////////////////////
        // DELETE COMMENT
        //////////////////////////////////////////////////////

        await commentModel.deleteComment(

            commentId,

        );

        //////////////////////////////////////////////////////
        // TOTAL COMMENTS
        //////////////////////////////////////////////////////

        const commentsCount =

            await commentModel.countComments(

                comment.post_id,

            );

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.postComment({

            postId:
            Number(comment.post_id),

            commentId:
            Number(commentId),

            deleted: true,

            comments:
            commentsCount,

            viewers: [],

        });

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            commentId:
            Number(commentId),

            comments_count:
            commentsCount,

            message:
            "Comment deleted successfully",

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
deleteCommentController;