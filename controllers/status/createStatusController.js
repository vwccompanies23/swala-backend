const pool = require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const {
    getAudience,
} = require("../../services/status/statusAudienceService");

const createStatusController = async (req, res) => {

    try {

        const {

            user_id,
            media_url,
            caption,
            is_video,
            is_text,
            duration_hours,
            privacy,

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

        const user =
        userResult.rows[0];

        //////////////////////////////////////////////////////
        // VALIDATE CONTENT
        //////////////////////////////////////////////////////

        const hasMedia =

            media_url &&
            media_url.trim() !== "";

        const hasCaption =

            caption &&
            caption.trim() !== "";

        if (!hasMedia && !hasCaption) {

            return res.status(400).json({

                success: false,
                error: "Status cannot be empty",

            });

        }

        //////////////////////////////////////////////////////
        // VALIDATE DURATION
        //////////////////////////////////////////////////////

        const duration =
            Number(duration_hours) === 48
                ? 48
                : 24;

        //////////////////////////////////////////////////////
        // VALIDATE PRIVACY
        //////////////////////////////////////////////////////

        const allowedPrivacy = [

            "contacts",
            "everyone",
            "selected",
            "excluded",

        ];

        const statusPrivacy =

            allowedPrivacy.includes(privacy)

                ? privacy

                : "contacts";

        //////////////////////////////////////////////////////
        // CREATE STATUS
        //////////////////////////////////////////////////////

        const result =
        await pool.query(

            `
            INSERT INTO statuses
            (

                user_id,

                media_url,

                caption,

                is_video,

                is_text,

                duration_hours,

                privacy,

                expires_at

            )

            VALUES
            (

                $1,

                $2,

                $3,

                $4,

                $5,

                $6,

                $7,

                NOW() + ($6 || ' hours')::INTERVAL

            )

            RETURNING *;
            `,

            [

                user.id,

                media_url || "",

                caption || "",

                is_video || false,

                is_text || false,

                duration,

                statusPrivacy,

            ],

        );

        //////////////////////////////////////////////////////
        // SAVED STATUS
        //////////////////////////////////////////////////////

        const status =
        result.rows[0];

        //////////////////////////////////////////////////////
        // STATUS AUDIENCE
        //////////////////////////////////////////////////////

        let audience = [];

        if (statusPrivacy === "contacts") {

            audience =
            await getAudience(user.id);

        }

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.status({

            type: "status_created",

            viewers:

            statusPrivacy === "everyone"

                ? []

                : audience.map(

                    contact =>

                    contact.contact_user_id,

                ),

            status: {

                id:
                status.id,

                user_id:
                user.id,

                full_name:
                user.full_name,

                username:
                user.username,

                profile_image:
                user.profile_image,

                media_url:
                status.media_url,

                caption:
                status.caption,

                is_video:
                status.is_video,

                is_text:
                status.is_text,

                privacy:
                status.privacy,

                duration_hours:
                status.duration_hours,

                created_at:
                status.created_at,

                expires_at:
                status.expires_at,

            },

        });

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(201).json({

            success: true,

            message:
            "Status created successfully",

            status,

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
createStatusController;