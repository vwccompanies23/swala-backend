const pool = require("../../config/db");

const deleteCommentController = async (req, res) => {

    try {

        const { commentId } = req.params;

        const { user_id } = req.body;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (!commentId || !user_id) {

            return res.status(400).json({

                success: false,

                error: "commentId and user_id are required",

            });

        }

        //////////////////////////////////////////////////////
        // FIND COMMENT
        //////////////////////////////////////////////////////

        const result = await pool.query(

            `
            SELECT
                id,
                user_id
            FROM comments
            WHERE id = $1
            LIMIT 1
            `,

            [

                commentId,

            ],

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Comment not found",

            });

        }

        const comment = result.rows[0];

        //////////////////////////////////////////////////////
        // OWNER ONLY
        //////////////////////////////////////////////////////

        if (

            Number(comment.user_id) !== Number(user_id)

        ) {

            return res.status(403).json({

                success: false,

                error: "You are not allowed to delete this comment",

            });

        }

        //////////////////////////////////////////////////////
        // DELETE COMMENT
        //////////////////////////////////////////////////////

        await pool.query(

            `
            DELETE FROM comments
            WHERE id = $1
            `,

            [

                commentId,

            ],

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            message: "Comment deleted successfully",

            commentId: Number(commentId),

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

module.exports = deleteCommentController;