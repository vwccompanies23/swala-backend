const pool = require("../../config/db");

const getStatusViewersController = async (req, res) => {

    try {

        const { statusId } = req.params;

        const { user_id } = req.query;

        //////////////////////////////////////////////////////
        // REQUIRED
        //////////////////////////////////////////////////////

        if (!statusId || !user_id) {

            return res.status(400).json({

                success: false,

                error: "statusId and user_id are required",

            });

        }

        //////////////////////////////////////////////////////
        // VERIFY STATUS
        //////////////////////////////////////////////////////

        const statusResult = await pool.query(

            `
            SELECT

                id,

                user_id,

                expires_at,

                created_at

            FROM statuses

            WHERE id = $1

            LIMIT 1
            `,

            [

                statusId,

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
        // ONLY OWNER
        //////////////////////////////////////////////////////

        if (

            Number(status.user_id) !== Number(user_id)

        ) {

            return res.status(403).json({

                success: false,

                error: "Only the owner can view viewers.",

            });

        }

        //////////////////////////////////////////////////////
        // GET VIEWERS
        //////////////////////////////////////////////////////

        const viewersResult = await pool.query(

            `
            SELECT

                u.id,

                u.full_name,

                u.username,

                u.profile_image,

                sv.viewed_at

            FROM status_views sv

            JOIN users u

            ON u.id = sv.viewer_id

            WHERE sv.status_id = $1

            ORDER BY sv.viewed_at DESC
            `,

            [

                statusId,

            ],

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            status: {

                id: status.id,

                created_at: status.created_at,

                expires_at: status.expires_at,

            },

            totalViews:

            viewersResult.rows.length,

            viewers:

            viewersResult.rows,

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
getStatusViewersController;