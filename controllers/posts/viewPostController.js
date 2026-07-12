const pool = require("../../config/db");

const viewPostController = async (req, res) => {

    try {

        const {

            post_id,

            viewer_id,

        } = req.body;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (!post_id || !viewer_id) {

            return res.status(400).json({

                success: false,

                error: "post_id and viewer_id are required",

            });

        }

        //////////////////////////////////////////////////////
        // DON'T COUNT OWNER VIEW
        //////////////////////////////////////////////////////

        const owner = await pool.query(

            `
            SELECT user_id
            FROM posts
            WHERE id = $1
            LIMIT 1
            `,

            [

                post_id,

            ],

        );

        if (owner.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Post not found",

            });

        }

        if (

            Number(owner.rows[0].user_id) ===

            Number(viewer_id)

        ) {

            return res.json({

                success: true,

                message: "Owner view ignored",

            });

        }

        //////////////////////////////////////////////////////
        // SAVE VIEW
        //////////////////////////////////////////////////////

        await pool.query(

            `
            INSERT INTO post_views
            (
                post_id,
                viewer_id
            )
            VALUES
            (
                $1,
                $2
            )
            ON CONFLICT
            (
                post_id,
                viewer_id
            )
            DO NOTHING
            `,

            [

                post_id,

                viewer_id,

            ],

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            message: "View recorded",

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

module.exports = viewPostController;