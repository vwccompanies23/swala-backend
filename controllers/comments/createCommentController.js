const pool = require("../../config/db");

const commentModel =
require("../../models/comments/commentModel");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const createCommentController = async (req, res) => {

    try {

        const {

            post_id,
            user_id,
            comment,
            parent_comment_id,

        } = req.body;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (!post_id || !user_id) {

            return res.status(400).json({

                success: false,

                error: "post_id and user_id are required",

            });

        }

        if (!comment || comment.trim() === "") {

            return res.status(400).json({

                success: false,

                error: "Comment cannot be empty",

            });

        }

        //////////////////////////////////////////////////////
        // VERIFY POST
        //////////////////////////////////////////////////////

        const postResult = await pool.query(

            `
            SELECT
                id,
                user_id
            FROM posts
            WHERE id = $1
            LIMIT 1
            `,

            [

                post_id,

            ],

        );

        if (postResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Post not found",

            });

        }

        const post = postResult.rows[0];

        //////////////////////////////////////////////////////
        // VERIFY PARENT COMMENT
        //////////////////////////////////////////////////////

        if (parent_comment_id) {

            const parent = await commentModel.getComment(

                parent_comment_id,

            );

            if (!parent) {

                return res.status(404).json({

                    success: false,

                    error: "Parent comment not found",

                });

            }

        }

        //////////////////////////////////////////////////////
        // CREATE COMMENT
        //////////////////////////////////////////////////////

        const createdComment =
        await commentModel.createComment({

            postId: post_id,

            userId: user_id,

            parentCommentId:
            parent_comment_id,

            comment: comment.trim(),

        });

        //////////////////////////////////////////////////////
        // LOAD USER INFO
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
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.postComment({

            postId: Number(post_id),

            commentId:
            createdComment.id,

            userId: Number(user_id),

            comments:
            commentsCount,

            viewers: [],

        });

        //////////////////////////////////////////////////////
        // NOTIFICATION
        //////////////////////////////////////////////////////

        if (

            Number(post.user_id) !==

            Number(user_id)

        ) {

            eventDispatcher.notification({

                userId:

                Number(post.user_id),

                event:
                "post-commented",

                payload: {

                    postId:
                    Number(post_id),

                    commentId:
                    createdComment.id,

                    commentedBy:
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

            comment: {

                ...createdComment,

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
createCommentController;