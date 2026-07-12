const pool = require("../../config/db");

const {
    getAudience,
} = require("../../services/audience/audienceService");

const getPosts = async (req, res) => {

    try {

        const { user_id } = req.query;

        //////////////////////////////////////////////////////
        // USER REQUIRED
        //////////////////////////////////////////////////////

        if (!user_id) {

            return res.status(400).json({

                success: false,

                error: "User ID is required",

            });

        }

        //////////////////////////////////////////////////////
        // BUILD AUDIENCE
        //////////////////////////////////////////////////////

        const audience =
            await getAudience(user_id);

        const audienceIds =
            audience.map(user => user.id);

        //////////////////////////////////////////////////////
        // GET POSTS
        //////////////////////////////////////////////////////

        const result = await pool.query(

            `
            SELECT

                p.*,

                u.full_name,

                u.username,

                u.profile_image,

                (
                    SELECT COUNT(*)
                    FROM likes l
                    WHERE l.post_id = p.id
                )::INT AS likes_count,

                (
                    SELECT COUNT(*)
                    FROM comments c
                    WHERE
                        c.post_id = p.id
                    AND
                        c.is_deleted = FALSE
                )::INT AS comments_count,

                (
                    SELECT COUNT(*)
                    FROM shares s
                    WHERE
                        s.post_id = p.id
                )::INT AS shares_count,

                EXISTS(

                    SELECT 1

                    FROM likes l

                    WHERE

                        l.post_id = p.id

                    AND

                        l.user_id = $2

                ) AS is_liked

            FROM posts p

            JOIN users u

            ON u.id = p.user_id

            WHERE

            (

                p.expires_at IS NULL

                OR

                p.expires_at > NOW()

            )

            AND

            (

                p.user_id = $2

                OR

                p.privacy = 'everyone'

                OR

                (

                    p.privacy = 'contacts'

                    AND

                    p.user_id = ANY($1)

                )

            )

            ORDER BY

                p.created_at DESC
            `,

            [

                audienceIds,

                Number(user_id),

            ],

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            total: result.rows.length,

            posts: result.rows,

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

module.exports = getPosts;