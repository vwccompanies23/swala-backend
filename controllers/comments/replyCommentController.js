const pool = require("../../config/db");

const commentModel =
require("../../models/comments/commentModel");

const eventDispatcher =
require("../../realtime/EventDispatcher");

const replyCommentController = async (req, res) => {

    try {

        const {

            post_id,
            user_id,
            parent_comment_id,
            comment,

        } = req.body;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (

            !post_id ||

            !user_id ||

            !parent_comment_id ||

            !comment ||

            comment.trim() === ""

        ) {

            return res.status(400).json({

                success: false,

                error:
                "post_id, user_id, parent_comment_id and comment are required",

            });

        }

        //////////////////////////////////////////////////////
        // VERIFY PARENT COMMENT
        //////////////////////////////////////////////////////

        const parentComment =

            await commentModel.getComment(

                parent_comment_id,

            );

        if (!parentComment) {

            return res.status(404).json({

                success: false,

                error: "Parent comment not found",

            });

        }

        //////////////////////////////////////////////////////
        // CREATE REPLY
        //////////////////////////////////////////////////////

        const reply =

            await commentModel.createComment({

                postId: post_id,

                userId: user_id,

                parentCommentId:
                parent_comment_id,

                comment:
                comment.trim(),

            });

        //////////////////////////////////////////////////////
        // USER INFO
        //////////////////////////////////////////////////////

        const userResult = await pool.query(

            `
            SELECT

                full_name,

                username,

                profile_image

            FROM users

            WHERE id = $1

            LIMIT 1
            `,

            [

                user_id,

            ],

        );

        const user =
        userResult.rows[0];

        //////////////////////////////////////////////////////
        // TOTAL COMMENTS
        //////////////////////////////////////////////////////

        const commentsCount =

            await commentModel.countComments(

                post_id,

            );

        //////////////////////////////////////////////////////
        // TOTAL REPLIES
        //////////////////////////////////////////////////////

        const repliesCount =

            await commentModel.countReplies(

                parent_comment_id,

            );

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.postComment({

            action: "reply",

            postId: Number(post_id),

            parentCommentId:
            Number(parent_comment_id),

            replyId:
            reply.id,

            comments:
            commentsCount,

            replies:
            repliesCount,

            viewers: [],

        });

        //////////////////////////////////////////////////////
        // NOTIFICATION
        //////////////////////////////////////////////////////

        if (

            Number(parentComment.user_id) !==

            Number(user_id)

        ) {

            eventDispatcher.notification({

                userId:

                Number(parentComment.user_id),

                event:

                "comment-replied",

                payload: {

                    postId:
                    Number(post_id),

                    commentId:
                    Number(parent_comment_id),

                    replyId:
                    reply.id,

                    repliedBy:
                    Number(user_id),

                },

            });

        }

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(201).json({

            success: true,

            comments_count:
            commentsCount,

            replies_count:
            repliesCount,

            reply: {

                ...reply,

                full_name:
                user.full_name,

                username:
                user.username,

                profile_image:
                user.profile_image,

            },

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
replyCommentController;