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

            u.profile_image,

            mm.media_type,

            mm.file_name,

            mm.original_name,

            mm.file_path,

            mm.file_url,

            mm.mime_type,

            mm.file_size

        FROM messages m

        LEFT JOIN users u

        ON u.id = m.sender_id

        LEFT JOIN media_messages mm

        ON mm.message_id = m.id

        WHERE m.chat_id = $1

        ORDER BY m.created_at ASC

        `,

        [
            chat_id,
        ],

        );

        const messages = result.rows.map((message) => {

            return {

                ...message,

                media: message.media_type

                    ? {

                        type: message.media_type,

                        fileName: message.file_name,

                        originalName: message.original_name,

                        path: message.file_path,

                        url: message.file_url,

                        mimeType: message.mime_type,

                        size: message.file_size,

                    }

                    : null,

            };

        });

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

            messages,

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