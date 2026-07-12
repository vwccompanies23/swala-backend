const pool = require("../../config/db");

const getPostViewersController = async (req, res) => {

    try {

        const { postId } = req.params;

        const { user_id } = req.query;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (!postId || !user_id) {

            return res.status(400).json({

                success: false,

                error: "postId and user_id are required",

            });

        }

        //////////////////////////////////////////////////////
        // VERIFY OWNER
        //////////////////////////////////////////////////////

        const owner = await pool.query(

            `
            SELECT user_id
            FROM posts
            WHERE id = $1
            LIMIT 1
            `,

            [

                postId,

            ],

        );

        if (owner.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Post not found",

            });

        }

        if (

            Number(owner.rows[0].user_id) !==

            Number(user_id)

        ) {

            return res.status(403).json({

                success: false,

                error: "Only the owner can view post viewers",

            });

        }

        //////////////////////////////////////////////////////
        // LOAD VIEWERS
        //////////////////////////////////////////////////////

        const viewers = await pool.query(

            `
            SELECT

                u.id,

                u.full_name,

                u.username,

                u.profile_image,

                pv.viewed_at

            FROM post_views pv

            JOIN users u

            ON u.id = pv.viewer_id

            WHERE pv.post_id = $1

            ORDER BY pv.viewed_at DESC
            `,

            [

                postId,

            ],

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            total: viewers.rows.length,

            viewers: viewers.rows,

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

module.exports = getPostViewersController;