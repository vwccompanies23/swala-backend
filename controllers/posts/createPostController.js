const pool = require("../../config/db");

const createPost = async (req, res) => {

    try {

        const {

            user_id,
            content,
            media_url,
            cloudinary_public_id,
            is_video,
            privacy,
            lifetime,

        } = req.body;

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
        // USER EXISTS
        //////////////////////////////////////////////////////

        const userResult = await pool.query(

            `
            SELECT
                id,
                full_name,
                username,
                profile_image
            FROM users
            WHERE id = $1
            LIMIT 1
            `,

            [user_id],

        );

        if (userResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "User not found",

            });

        }

        const user = userResult.rows[0];

        //////////////////////////////////////////////////////
        // VALIDATE CONTENT
        //////////////////////////////////////////////////////

        const hasMedia =
            media_url &&
            media_url.trim() !== "";

        const hasText =
            content &&
            content.trim() !== "";

        if (!hasMedia && !hasText) {

            return res.status(400).json({

                success: false,

                error: "Post cannot be empty",

            });

        }

        //////////////////////////////////////////////////////
        // PRIVACY
        //////////////////////////////////////////////////////

        const allowedPrivacy = [

            "contacts",

            "everyone",

            "selected",

            "excluded",

        ];

        const postPrivacy =

            allowedPrivacy.includes(privacy)

                ? privacy

                : "contacts";

       //////////////////////////////////////////////////////
       // LIFETIME
       //////////////////////////////////////////////////////

       const allowedLifetimes = [

           "24h",

           "48h",

           "72h",

           "1_week",

           "2_weeks",

           "1_month",

           "2_months",

           "1_year",

           "forever",

       ];

       const postLifetime =

           allowedLifetimes.includes(lifetime)

               ? lifetime

               : "forever";

        let expiresAt = null;

        switch (postLifetime) {

            case "24h":

                expiresAt = new Date(
                    Date.now() + 24 * 60 * 60 * 1000,
                );

                break;

            case "48h":

                expiresAt = new Date(
                    Date.now() + 48 * 60 * 60 * 1000,
                );

                break;

            case "72h":

                expiresAt = new Date(
                    Date.now() + 72 * 60 * 60 * 1000,
                );

                break;

            case "1_week":

                expiresAt = new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000,
                );

                break;

            case "2_weeks":

                expiresAt = new Date(
                    Date.now() + 14 * 24 * 60 * 60 * 1000,
                );

                break;

            case "1_month":

                expiresAt = new Date();

                expiresAt.setMonth(
                    expiresAt.getMonth() + 1,
                );

                break;

            case "2_months":

                expiresAt = new Date();

                expiresAt.setMonth(
                    expiresAt.getMonth() + 2,
                );

                break;

            case "1_year":

                expiresAt = new Date();

                expiresAt.setFullYear(
                    expiresAt.getFullYear() + 1,
                );

                break;

            case "forever":

            default:

                expiresAt = null;

                break;

        }

        //////////////////////////////////////////////////////
        // SAVE POST
        //////////////////////////////////////////////////////

        const result = await pool.query(

            `
            INSERT INTO posts
            (
                user_id,
                content,
                media_url,
                cloudinary_public_id,
                is_video,
                privacy,
                lifetime,
                expires_at
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8
            )
            RETURNING *;
            `,

            [

                user.id,

                content || "",

                media_url || "",

                cloudinary_public_id || null,

                is_video || false,

                postPrivacy,

                postLifetime,

                expiresAt,

            ],

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(201).json({

            success: true,

            post: {

                ...result.rows[0],

                full_name: user.full_name,

                username: user.username,

                profile_image: user.profile_image,

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

module.exports = createPost;