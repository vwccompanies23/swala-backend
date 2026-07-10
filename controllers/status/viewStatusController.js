const pool = require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const viewStatusController = async (req, res) => {

    try {

        const {

            status_id,

            viewer_id,

        } = req.body;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (!status_id || !viewer_id) {

            return res.status(400).json({

                success: false,

                error: "status_id and viewer_id are required",

            });

        }

        //////////////////////////////////////////////////////
        // VERIFY VIEWER
        //////////////////////////////////////////////////////

        const viewerResult = await pool.query(

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

            [

                viewer_id,

            ],

        );

        if (viewerResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Viewer not found",

            });

        }

        const viewer =
        viewerResult.rows[0];

        //////////////////////////////////////////////////////
        // VERIFY STATUS
        //////////////////////////////////////////////////////

        const statusResult = await pool.query(

            `
            SELECT
                id,
                user_id,
                expires_at
            FROM statuses
            WHERE id = $1
            LIMIT 1
            `,

            [

                status_id,

            ],

        );

        if (statusResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Status not found",

            });

        }

        const status =
        statusResult.rows[0];

        //////////////////////////////////////////////////////
        // STATUS EXPIRED
        //////////////////////////////////////////////////////

        if (

            new Date(status.expires_at) <= new Date()

        ) {

            return res.status(410).json({

                success: false,

                error: "Status has expired",

            });

        }

        //////////////////////////////////////////////////////
        // OWNER CANNOT VIEW OWN STATUS
        //////////////////////////////////////////////////////

        if (

            Number(status.user_id) === Number(viewer_id)

        ) {

            return res.json({

                success: true,

                message: "Own status",

                views: 0,

            });

        }

        //////////////////////////////////////////////////////
        // SAVE VIEW
        //////////////////////////////////////////////////////

        await pool.query(

            `
            INSERT INTO status_views
            (

                status_id,

                viewer_id

            )

            VALUES
            (

                $1,

                $2

            )

            ON CONFLICT
            (

                status_id,

                viewer_id

            )

            DO NOTHING
            `,

            [

                status_id,

                viewer_id,

            ],

        );

        //////////////////////////////////////////////////////
        // TOTAL VIEWS
        //////////////////////////////////////////////////////

        const count =
        await pool.query(

            `
            SELECT
                COUNT(*)::INTEGER AS total
            FROM status_views
            WHERE status_id = $1
            `,

            [

                status_id,

            ],

        );

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.status({

            viewers: [

                status.user_id,

            ],

            type: "status_viewed",

            statusId: status_id,

            viewer: {

                id: viewer.id,

                full_name: viewer.full_name,

                username: viewer.username,

                profile_image: viewer.profile_image,

            },

            totalViews:

            count.rows[0].total,

        });

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            totalViews:

            count.rows[0].total,

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
viewStatusController;