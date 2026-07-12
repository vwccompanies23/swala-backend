const pool = require("../../config/db");
const cloudinary = require("../../config/cloudinary");

const deletePostController = async (req, res) => {

    try {

        const { postId } = req.params;

        const { user_id } = req.body;

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
        // FIND POST
        //////////////////////////////////////////////////////

        const result = await pool.query(

            `
            SELECT
                id,
                user_id,
                cloudinary_public_id
            FROM posts
            WHERE id = $1
            LIMIT 1
            `,

            [

                postId,

            ],

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Post not found",

            });

        }

        const post = result.rows[0];

        //////////////////////////////////////////////////////
        // OWNER ONLY
        //////////////////////////////////////////////////////

        if (Number(post.user_id) !== Number(user_id)) {

            return res.status(403).json({

                success: false,

                error: "You are not allowed to delete this post",

            });

        }

        //////////////////////////////////////////////////////
        // DELETE CLOUDINARY MEDIA
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
        // DELETE COMMENTS
        //////////////////////////////////////////////////////

        await pool.query(

            `
            DELETE FROM comments
            WHERE post_id = $1
            `,

            [

                postId,

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

                postId,

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

                postId,

            ],

        );
        //////////////////////////////////////////////////////
        // DELETE VIEWS
        //////////////////////////////////////////////////////

        await pool.query(

            `
            DELETE FROM post_views
            WHERE post_id = $1
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

            message: "Post deleted successfully",

            postId: Number(postId),

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

module.exports = deletePostController;