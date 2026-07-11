const pool = require("../../config/db");
const fs = require("fs");
const path = require("path");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const {
    getAudience,
} = require("../../services/status/statusAudienceService");

const deleteStatusController = async (req, res) => {

    try {

        const { statusId } = req.params;

        const { user_id } = req.body;

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
        // FIND STATUS
        //////////////////////////////////////////////////////

        const result = await pool.query(

            `
            SELECT
                id,
                user_id,
                media_url
            FROM statuses
            WHERE id = $1
            LIMIT 1
            `,

            [

                statusId,

            ],

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Status not found",

            });

        }

        const status =
        result.rows[0];

        //////////////////////////////////////////////////////
        // OWNER ONLY
        //////////////////////////////////////////////////////

        if (

            Number(status.user_id) !== Number(user_id)

        ) {

            return res.status(403).json({

                success: false,

                error: "You are not allowed to delete this status",

            });

        }

        //////////////////////////////////////////////////////
        // GET AUDIENCE
        //////////////////////////////////////////////////////

        const audience =
        await getAudience(user_id);

        //////////////////////////////////////////////////////
        // DELETE MEDIA
        //////////////////////////////////////////////////////

        if (status.media_url) {

            try {

                const filePath = path.join(

                    __dirname,

                    "../../uploads/status",

                    path.basename(status.media_url),

                );

                if (

                    fs.existsSync(filePath)

                ) {

                    fs.unlinkSync(filePath);

                }

            }

            catch (e) {

                console.error(

                    "Failed deleting status media:",

                    e,

                );

            }

        }

        //////////////////////////////////////////////////////
        // DELETE VIEWS
        //////////////////////////////////////////////////////

        await pool.query(

            `
            DELETE FROM status_views
            WHERE status_id = $1
            `,

            [

                statusId,

            ],

        );

        //////////////////////////////////////////////////////
        // DELETE STATUS
        //////////////////////////////////////////////////////

        const deleted = await pool.query(
            `
            DELETE FROM statuses
            WHERE id = $1
            RETURNING id;
            `,
            [statusId],
        );

        console.log("Deleted status:", deleted.rows);

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.status({

            type: "status_deleted",

            statusId:

            Number(statusId),

            viewers:

            audience.map(

                contact =>

                contact.contact_user_id,

            ),

        });

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            message:

            "Status deleted successfully",

            statusId:

            Number(statusId),

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
deleteStatusController;