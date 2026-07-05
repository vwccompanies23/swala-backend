const pool = require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const createMediaMessage = async (req, res) => {

    try {

        const {

            sender_id,

            receiver_id,

            message = "",

            message_type,

            media_url,

            file_name = "",

            file_size = 0,

        } = req.body;

        //////////////////////////////////////////////////////
        // VALIDATION
        //////////////////////////////////////////////////////

        if (!media_url) {

            return res.status(400).json({

                success: false,

                error: "media_url is required",

            });

        }

        //////////////////////////////////////////////////////
        // FIND OR CREATE CHAT
        //////////////////////////////////////////////////////

        let chat = await pool.query(

            `
            SELECT id
            FROM chats
            WHERE
            (
                user_one_id=$1
                AND user_two_id=$2
            )
            OR
            (
                user_one_id=$2
                AND user_two_id=$1
            )
            LIMIT 1
            `,
            [
                sender_id,
                receiver_id,
            ]

        );

        let chatId;

        if (chat.rows.length == 0) {

            const created = await pool.query(

                `
                INSERT INTO chats
                (
                    user_one_id,
                    user_two_id
                )
                VALUES
                (
                    $1,
                    $2
                )
                RETURNING id
                `,
                [
                    sender_id,
                    receiver_id,
                ]

            );

            chatId = created.rows[0].id;

        } else {

            chatId = chat.rows[0].id;

        }

        //////////////////////////////////////////////////////
        // SAVE MESSAGE
        //////////////////////////////////////////////////////

        const inserted = await pool.query(

            `
            INSERT INTO messages
            (
                chat_id,
                sender_id,
                message,
                message_type,
                media_url,
                file_name,
                file_size
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7
            )
            RETURNING *
            `,
            [
                chatId,
                sender_id,
                message,
                message_type,
                media_url,
                file_name,
                file_size,
            ]

        );

        //////////////////////////////////////////////////////
        // LOAD COMPLETE MESSAGE
        //////////////////////////////////////////////////////

        const fullMessage = await pool.query(

            `
            SELECT

                m.*,

                u.full_name AS sender_name,

                u.username,

                u.profile_image

            FROM messages m

            JOIN users u
            ON u.id=m.sender_id

            WHERE m.id=$1
            `,
            [
                inserted.rows[0].id,
            ]

        );

        const messageData = fullMessage.rows[0];

        messageData.is_image_message =
            messageData.message_type === "image";

        messageData.is_video_message =
            messageData.message_type === "video";

        messageData.is_voice_message =
            messageData.message_type === "voice";

        messageData.is_audio_message =
            messageData.message_type === "audio";

        messageData.is_document_message =
            messageData.message_type === "document";

        messageData.image_path =
            messageData.media_url;

        messageData.video_path =
            messageData.media_url;

        messageData.audio_path =
            messageData.media_url;

        messageData.document_path =
            messageData.media_url;

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.chat({

            receiverId: receiver_id,

            ...messageData,

        });

        eventDispatcher.chat({

            receiverId: sender_id,

            ...messageData,

        });

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(201).json({

            success: true,

            message: messageData,

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

module.exports = createMediaMessage;