const pool = require("../../config/db");

const cloudinary =
require("../../config/cloudinary");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const {
    getAudience,
} = require("../../services/status/statusAudienceService");

const deleteExpiredStatusesController = async (req, res) => {

    try {

        //////////////////////////////////////////////////////
        // FIND EXPIRED STATUSES
        //////////////////////////////////////////////////////

        const expiredStatuses = await pool.query(

            `
            SELECT
                id,
                user_id,
                media_url,
                cloudinary_public_id,
                is_video
            FROM statuses
            WHERE expires_at <= NOW()
            `

        );

        let deleted = 0;

        //////////////////////////////////////////////////////
        // DELETE EACH STATUS
        //////////////////////////////////////////////////////

        for (const status of expiredStatuses.rows) {

            //////////////////////////////////////////////////////
            // GET AUDIENCE
            //////////////////////////////////////////////////////

            const audience =
            await getAudience(status.user_id);

            //////////////////////////////////////////////////////
            // DELETE FROM CLOUDINARY
            //////////////////////////////////////////////////////

            if (status.cloudinary_public_id) {

                try {

                    await cloudinary.uploader.destroy(

                        status.cloudinary_public_id,

                        {

                            resource_type:

                            status.is_video

                                ? "video"

                                : "image",

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
            // DELETE STATUS VIEWS
            //////////////////////////////////////////////////////

            await pool.query(

                `
                DELETE FROM status_views
                WHERE status_id = $1
                `,

                [

                    status.id,

                ],

            );

            //////////////////////////////////////////////////////
            // DELETE STATUS
            //////////////////////////////////////////////////////

            await pool.query(

                `
                DELETE FROM statuses
                WHERE id = $1
                `,

                [

                    status.id,

                ],

            );

            //////////////////////////////////////////////////////
            // REALTIME
            //////////////////////////////////////////////////////

            eventDispatcher.status({

                type: "status_expired",

                statusId: status.id,

                viewers:

                audience.map(

                    contact =>

                    contact.contact_user_id,

                ),

            });

            deleted++;

        }

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            deleted,

            message:

            "Expired statuses deleted successfully",

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
deleteExpiredStatusesController;