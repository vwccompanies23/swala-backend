const pool = require("../../config/db");

const likeModel =
require("../../models/likes/likeModel");

const eventDispatcher =
require("../../realtime/EventDispatcher");

const toggleLike = async (req, res) => {

    try {

        const {

            post_id,
            user_id,

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
        // ALREADY LIKED?
        //////////////////////////////////////////////////////

        const existingLike =

            await likeModel.findLike(

                post_id,

                user_id,

            );

        //////////////////////////////////////////////////////
        // UNLIKE
        //////////////////////////////////////////////////////

        if (existingLike) {

            await likeModel.deleteLike(

                post_id,

                user_id,

            );

        }

        //////////////////////////////////////////////////////
        // LIKE
        //////////////////////////////////////////////////////

        else {

            await likeModel.createLike(

                post_id,

                user_id,

            );

        }

        //////////////////////////////////////////////////////
        // UPDATED COUNT
        //////////////////////////////////////////////////////

        const likesCount =

            await likeModel.countLikes(

                post_id,

            );

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.postLike({

            postId: Number(post_id),

            userId: Number(user_id),

            liked: !existingLike,

            likes: likesCount,

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

                userId: Number(post.user_id),

                event: "post-liked",

                payload: {

                    postId: Number(post_id),

                    likedBy: Number(user_id),

                    likes: likesCount,

                },

            });

        }

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            post_id: Number(post_id),

            user_id: Number(user_id),

            liked: !existingLike,

            likes_count: likesCount,

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

module.exports = toggleLike;