const pool = require("../../config/db");

const shareModel =
require("../../models/shares/shareModel");

const getSharesController = async (req, res) => {

    try {

        const { post_id } = req.params;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (!post_id) {

            return res.status(400).json({

                success: false,

                error: "post_id is required",

            });

        }

        //////////////////////////////////////////////////////
        // VERIFY POST
        //////////////////////////////////////////////////////

        const post = await pool.query(

            `
            SELECT id
            FROM posts
            WHERE id = $1
            LIMIT 1
            `,

            [

                post_id,

            ],

        );

        if (post.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Post not found",

            });

        }

        //////////////////////////////////////////////////////
        // LOAD SHARES
        //////////////////////////////////////////////////////

        const shares =
        await shareModel.getPostShares(

            post_id,

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            post_id:
            Number(post_id),

            total:
            shares.length,

            shares,

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
getSharesController;