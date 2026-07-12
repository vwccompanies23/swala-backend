const pool = require("../../config/db");
const cloudinary = require("../../config/cloudinary");

const deleteExpiredPostsController = async (req, res) => {

    try {

        //////////////////////////////////////////////////////
        // FIND EXPIRED POSTS
        //////////////////////////////////////////////////////

        const expiredPosts = await pool.query(

            `
            SELECT
                id,
                user_id,
                cloudinary_public_id
            FROM posts
            WHERE
                lifetime <> 'forever'
            AND
                expires_at IS NOT NULL
            AND
                expires_at <= NOW()
            `

        );

        let deleted = 0;

        //////////////////////////////////////////////////////
        // DELETE EACH POST
        //////////////////////////////////////////////////////

        for (const post of expiredPosts.rows) {

            //////////////////////////////////////////////////////
            // DELETE CLOUDINARY
            //////////////////////////////////////////////////////

            if (post.cloudinary_public_id) {

                try {

                    await cloudinary.uploader.destroy(

                        post.cloudinary_public_id,

                        {

                            resource_type: "auto",

                        },

                    );

                }

                catch (error) {

                    console.error(
                        "Cloudinary delete error:",
                        error,
                    );

                }

            }
            //////////////////////////////////////////////////////
            // DELETE POST VIEWS
            //////////////////////////////////////////////////////

            await pool.query(

                `
                DELETE FROM post_views
                WHERE post_id = $1
                `,

                [

                    post.id,

                ],

            );

            //////////////////////////////////////////////////////
            // DELETE COMMENTS
            //////////////////////////////////////////////////////

            await pool.query(

                `
                DELETE FROM comments
                WHERE post_id = $1
                `,

                [

                    post.id,

                ],

            );

            //////////////////////////////////////////////////////
            // DELETE LIKES
            //////////////////////////////////////////////////////

            await pool.query(

                `
                DELETE FROM likes
                WHERE post_id = $1
                `,

                [

                    post.id,

                ],

            );

            //////////////////////////////////////////////////////
            // DELETE POST
            //////////////////////////////////////////////////////

            await pool.query(

                `
                DELETE FROM posts
                WHERE id = $1
                `,

                [

                    post.id,

                ],

            );

            deleted++;

        }

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            deleted,

            message:
            "Expired posts deleted successfully",

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
deleteExpiredPostsController;