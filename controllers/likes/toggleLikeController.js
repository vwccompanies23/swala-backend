const pool = require("../../config/db");

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
        // VERIFY POST EXISTS
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
        // ALREADY LIKED?
        //////////////////////////////////////////////////////

        const existingLike = await pool.query(

            `
            SELECT id
            FROM likes
            WHERE
                post_id = $1
            AND
                user_id = $2
            LIMIT 1
            `,

            [

                post_id,

                user_id,

            ],

        );

        //////////////////////////////////////////////////////
        // UNLIKE
        //////////////////////////////////////////////////////

        if (existingLike.rows.length > 0) {

            await pool.query(

                `
                DELETE FROM likes
                WHERE
                    post_id = $1
                AND
                    user_id = $2
                `,

                [

                    post_id,

                    user_id,

                ],

            );

        }

        //////////////////////////////////////////////////////
        // LIKE
        //////////////////////////////////////////////////////

        else {

            await pool.query(

                `
                INSERT INTO likes
                (
                    post_id,
                    user_id
                )
                VALUES
                (
                    $1,
                    $2
                )
                ON CONFLICT
                (
                    post_id,
                    user_id
                )
                DO NOTHING
                `,

                [

                    post_id,

                    user_id,

                ],

            );

        }

        //////////////////////////////////////////////////////
        // TOTAL LIKES
        //////////////////////////////////////////////////////

        const count = await pool.query(

            `
            SELECT COUNT(*) AS total
            FROM likes
            WHERE post_id = $1
            `,

            [

                post_id,

            ],

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            liked:

                existingLike.rows.length === 0,

            likes_count:

                Number(count.rows[0].total),

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