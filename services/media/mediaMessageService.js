const db = require("../../config/db");

class MediaMessageService {

    //////////////////////////////////////////////////////
    // SAVE MEDIA
    //////////////////////////////////////////////////////

    async save({

        messageId,

        chatId,

        senderId,

        mediaType,

        fileName,

        originalName,

        filePath,

        fileUrl,

        mimeType,

        fileSize,

    }) {

        const result = await db.query(

            `
            INSERT INTO media_messages (

                message_id,

                chat_id,

                sender_id,

                media_type,

                file_name,

                original_name,

                file_path,

                file_url,

                mime_type,

                file_size

            )

            VALUES (

                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10

            )

            RETURNING *;
            `,

            [

                messageId,

                chatId,

                senderId,

                mediaType,

                fileName,

                originalName,

                filePath,

                fileUrl,

                mimeType,

                fileSize,

            ],

        );

        return result.rows[0];

    }

    //////////////////////////////////////////////////////
    // GET MESSAGE MEDIA
    //////////////////////////////////////////////////////

    async getByMessageId(messageId) {

        const result = await db.query(

            `
            SELECT *
            FROM media_messages
            WHERE message_id = $1
            `,

            [

                messageId,

            ],

        );

        return result.rows[0] || null;

    }

    //////////////////////////////////////////////////////
    // GET CHAT MEDIA
    //////////////////////////////////////////////////////

    async getChatMedia(chatId) {

        const result = await db.query(

            `
            SELECT *
            FROM media_messages
            WHERE chat_id = $1
            ORDER BY created_at ASC
            `,

            [

                chatId,

            ],

        );

        return result.rows;

    }

    //////////////////////////////////////////////////////
    // DELETE MEDIA
    //////////////////////////////////////////////////////

    async delete(messageId) {

        await db.query(

            `
            DELETE
            FROM media_messages
            WHERE message_id = $1
            `,

            [

                messageId,

            ],

        );

    }

}

module.exports = new MediaMessageService();