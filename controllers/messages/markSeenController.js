const pool = require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const markSeen = async (req, res) => {

    try {

        const {

            messageId,

            senderId,

        } = req.body;

        if (

            !messageId ||

            !senderId

        ) {

            return res.status(400).json({

                success: false,

                error: "Missing required fields",

            });

        }

        //////////////////////////////////////////////////////
        // UPDATE DATABASE
        //////////////////////////////////////////////////////

        const result = await pool.query(

            `
            UPDATE messages
            SET
                is_read = TRUE
            WHERE
                id = $1
            RETURNING *
            `,

            [

                messageId,

            ],

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "Message not found",

            });

        }

        //////////////////////////////////////////////////////
        // REALTIME UPDATE
        //////////////////////////////////////////////////////

        eventDispatcher.notification({

            userId: senderId,

            event: "message-seen",

            payload: {

                messageId,

                seen: true,

            },

        });

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            messageId,

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

module.exports = markSeen;