const pool = require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const getMessages = async (req, res) => {

    try {

        const {

            chat_id,

        } = req.params;

        const {

            userId,

        } = req.query;

        if (!chat_id) {

            return res.status(400).json({

                success: false,

                error: "Chat ID is required",

            });

        }

        //////////////////////////////////////////////////////
        // LOAD MESSAGES
        //////////////////////////////////////////////////////

        const result = await pool.query(

            `
            SELECT

                m.*,

                u.full_name,

                u.username,

                u.profile_image

            FROM messages m

            LEFT JOIN users u

            ON u.id = m.sender_id

            WHERE m.chat_id = $1

            ORDER BY m.created_at ASC
            `,

            [

                chat_id,

            ],

        );

        //////////////////////////////////////////////////////
        // MARK DELIVERED
        //////////////////////////////////////////////////////

        if (userId) {

            await pool.query(

                `
                UPDATE messages
                SET is_delivered = TRUE
                WHERE
                    chat_id = $1
                    AND sender_id <> $2
                    AND is_delivered = FALSE
                `,

                [

                    chat_id,

                    userId,

                ],

            );

            const senders = [

                ...new Set(

                    result.rows

                        .filter(

                            m =>

                                m.sender_id != userId,

                        )

                        .map(

                            m => m.sender_id,

                        ),

                ),

            ];

            for (const senderId of senders) {

                eventDispatcher.notification({

                    userId: senderId,

                    event: "messages-delivered",

                    payload: {

                        chatId: chat_id,

                    },

                });

            }

        }

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(200).json({

            success: true,

            messages: result.rows,

        });

    }

    catch (error) {

        console.error(

            "Get Messages Error",

            error,

        );

        return res.status(500).json({

            success: false,

            error: error.message,

        });

    }

};

module.exports = getMessages;