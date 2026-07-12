const pool = require("../../config/db");

const eventDispatcher =
require("../../realtime/EventDispatcher");

const likeCommentController = async (req, res) => {

    try {

        const {

            comment_id,
            user_id,

        } = req.body;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (

            !comment_id ||

            !user_id

        ) {

            return res.status(400).json({

                success: false,

                error:
                "comment_id and user_id are required",

            });

        }

        //////////////////////////////////////////////////////
        // VERIFY COMMENT
        //////////////////////////////////////////////////////

        const commentResult = await pool.query(

            `
            SELECT
                id,
                user_id,
                post_id
            FROM comments
            WHERE id = $1
            LIMIT 1
            `,

            [

                comment_id,

            ],

        );

        if (

            commentResult.rows.length === 0

        ) {

            return res.status(404).json({

                success: false,

                error:
                "Comment not found",

            });

        }

        const comment =
        commentResult.rows[0];

        //////////////////////////////////////////////////////
        // ALREADY LIKED?
        //////////////////////////////////////////////////////

        const existing = await pool.query(

            `
            SELECT id

            FROM comment_likes

            WHERE

                comment_id = $1

            AND

                user_id = $2

            LIMIT 1
            `,

            [

                comment_id,

                user_id,

            ],

        );

        let liked = false;

        //////////////////////////////////////////////////////
        // TOGGLE
        //////////////////////////////////////////////////////

        if (

            existing.rows.length > 0

        ) {

            await pool.query(

                `
                DELETE FROM comment_likes

                WHERE

                    comment_id = $1

                AND

                    user_id = $2
                `,

                [

                    comment_id,

                    user_id,

                ],

            );

        }

        else {

            liked = true;

            await pool.query(

                `
                INSERT INTO comment_likes
                (
                    comment_id,
                    user_id
                )
                VALUES
                (
                    $1,
                    $2
                )
                `,

                [

                    comment_id,

                    user_id,

                ],

            );

        }

        //////////////////////////////////////////////////////
        // COUNT
        //////////////////////////////////////////////////////

        const count = await pool.query(

            `
            SELECT COUNT(*) AS total

            FROM comment_likes

            WHERE comment_id = $1
            `,

            [

                comment_id,

            ],

        );

        const likesCount =
        Number(

            count.rows[0].total,

        );

        //////////////////////////////////////////////////////
        // UPDATE COMMENT
        //////////////////////////////////////////////////////

        await pool.query(

            `
            UPDATE comments

            SET likes_count = $2

            WHERE id = $1
            `,

            [

                comment_id,

                likesCount,

            ],

        );

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.postComment({

            action: "comment-liked",

            postId:
            Number(comment.post_id),

            commentId:
            Number(comment_id),

            liked,

            likes:
            likesCount,

            viewers: [],

        });

        //////////////////////////////////////////////////////
        // NOTIFICATION
        //////////////////////////////////////////////////////

        if (

            Number(comment.user_id) !==

            Number(user_id)

        ) {

            eventDispatcher.notification({

                userId:
                Number(comment.user_id),

                event:
                "comment-liked",

                payload: {

                    postId:
                    Number(comment.post_id),

                    commentId:
                    Number(comment_id),

                    likedBy:
                    Number(user_id),

                },

            });

        }

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            liked,

            likes_count:
            likesCount,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error:
            error.message,

        });

    }

};

module.exports =
likeCommentController;