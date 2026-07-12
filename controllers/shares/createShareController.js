const pool = require("../../config/db");

const shareModel =
require("../../models/shares/shareModel");

const eventDispatcher =
require("../../realtime/EventDispatcher");

const createShareController = async (req, res) => {

    try {

        const {

            post_id,
            user_id,
            share_type,
            destination_type,
            destination_id,

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

        const post =
        postResult.rows[0];

        //////////////////////////////////////////////////////
        // CREATE SHARE
        //////////////////////////////////////////////////////

        const share =
        await shareModel.createShare({

            postId: post_id,

            userId: user_id,

            shareType:
                share_type || "internal",

            destinationType:
                destination_type,

            destinationId:
                destination_id,

        });

        //////////////////////////////////////////////////////
        // TOTAL SHARES
        //////////////////////////////////////////////////////

        const sharesCount =
        await shareModel.countShares(

            post_id,

        );

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.postShare({

            postId:
            Number(post_id),

            shareId:
            share.id,

            userId:
            Number(user_id),

            shares:
            sharesCount,

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
                "post-shared",

                payload: {

                    postId:
                    Number(post_id),

                    shareId:
                    share.id,

                    sharedBy:
                    Number(user_id),

                },

            });

        }

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(201).json({

            success: true,

            shares_count:
            sharesCount,

            share,

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
createShareController;