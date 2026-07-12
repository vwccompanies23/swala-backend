const pool = require("../../config/db");

const createComment = async (req, res) => {

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
        // VERIFY PARENT COMMENT
        //////////////////////////////////////////////////////

        if (parent_comment_id) {

            const parent = await pool.query(

                `
                SELECT id
                FROM comments
                WHERE id = $1
                LIMIT 1
                `,

                [

                    parent_comment_id,

                ],

            );

            if (parent.rows.length === 0) {

                return res.status(404).json({

                    success: false,

                    error: "Parent comment not found",

                });

            }

        }

        //////////////////////////////////////////////////////
        // CREATE COMMENT
        //////////////////////////////////////////////////////

        const result = await pool.query(

            `
            INSERT INTO comments
            (
                post_id,
                user_id,
                parent_comment_id,
                comment
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING *
            `,

            [

                post_id,

                user_id,

                parent_comment_id || null,

                comment.trim(),

            ],

        );

        //////////////////////////////////////////////////////
        // LOAD USER INFO
        //////////////////////////////////////////////////////

        const user = await pool.query(

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

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(201).json({

            success: true,

            comment: {

                ...result.rows[0],

                full_name:

                    user.rows[0].full_name,

                username:

                    user.rows[0].username,

                profile_image:

                    user.rows[0].profile_image,

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

module.exports = createComment;