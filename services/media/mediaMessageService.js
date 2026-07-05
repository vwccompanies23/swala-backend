const db =
require("../../config/db");

class MediaMessageService {

    //////////////////////////////////////////////////////
    // SAVE MEDIA
    //////////////////////////////////////////////////////

    async save({

        messageId,

        chatId,

        senderId,

        mediaType = "document",

        fileName = "",

        originalName = "",

        filePath = "",

        fileUrl = "",

        mimeType = "",

        fileSize = 0,

        duration = 0,

        thumbnailUrl = "",

    }) {

        const result = await db.query(

            `
            INSERT INTO media_messages
            (

                message_id,

                chat_id,

                sender_id,

                media_type,

                file_name,

                original_name,

                file_path,

                file_url,

                mime_type,

                file_size,

                duration,

                thumbnail_url

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

                $8,

                $9,

                $10,

                $11,

                $12

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

                duration,

                thumbnailUrl,

            ],

        );

        return result.rows[0];

    }

    //////////////////////////////////////////////////////
        // GET MEDIA BY MESSAGE
        //////////////////////////////////////////////////////

        async getByMessageId(

            messageId,

        ) {

            const result = await db.query(

                `
                SELECT *
                FROM media_messages
                WHERE message_id = $1
                LIMIT 1
                `,

                [

                    messageId,

                ],

            );

            return result.rows[0] || null;

        }

        //////////////////////////////////////////////////////
        // GET ALL CHAT MEDIA
        //////////////////////////////////////////////////////

        async getChatMedia(

            chatId,

        ) {

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
        // GET MEDIA BY TYPE
        //////////////////////////////////////////////////////

        async getMediaByType(

            chatId,

            mediaType,

        ) {

            const result = await db.query(

                `
                SELECT *
                FROM media_messages
                WHERE

                    chat_id = $1

                    AND media_type = $2

                ORDER BY created_at ASC
                `,

                [

                    chatId,

                    mediaType,

                ],

            );

            return result.rows;

        }

        //////////////////////////////////////////////////////
        // GET IMAGES
        //////////////////////////////////////////////////////

        async getImages(

            chatId,

        ) {

            return await this.getMediaByType(

                chatId,

                "image",

            );

        }

        //////////////////////////////////////////////////////
        // GET VIDEOS
        //////////////////////////////////////////////////////

        async getVideos(

            chatId,

        ) {

            return await this.getMediaByType(

                chatId,

                "video",

            );

        }

        //////////////////////////////////////////////////////
            // GET VOICE MESSAGES
            //////////////////////////////////////////////////////

            async getVoiceMessages(

                chatId,

            ) {

                return await this.getMediaByType(

                    chatId,

                    "voice",

                );

            }

            //////////////////////////////////////////////////////
            // GET AUDIO
            //////////////////////////////////////////////////////

            async getAudio(

                chatId,

            ) {

                return await this.getMediaByType(

                    chatId,

                    "audio",

                );

            }

            //////////////////////////////////////////////////////
            // GET DOCUMENTS
            //////////////////////////////////////////////////////

            async getDocuments(

                chatId,

            ) {

                return await this.getMediaByType(

                    chatId,

                    "document",

                );

            }

            //////////////////////////////////////////////////////
            // GET GIFS
            //////////////////////////////////////////////////////

            async getGifs(

                chatId,

            ) {

                return await this.getMediaByType(

                    chatId,

                    "gif",

                );

            }

            //////////////////////////////////////////////////////
            // GET STICKERS
            //////////////////////////////////////////////////////

            async getStickers(

                chatId,

            ) {

                return await this.getMediaByType(

                    chatId,

                    "sticker",

                );

            }

            //////////////////////////////////////////////////////
            // GET LOCATIONS
            //////////////////////////////////////////////////////

            async getLocations(

                chatId,

            ) {

                return await this.getMediaByType(

                    chatId,

                    "location",

                );

            }

            //////////////////////////////////////////////////////
            // GET CONTACTS
            //////////////////////////////////////////////////////

            async getContacts(

                chatId,

            ) {

                return await this.getMediaByType(

                    chatId,

                    "contact",

                );

            }

            //////////////////////////////////////////////////////
            // GET POLLS
            //////////////////////////////////////////////////////

            async getPolls(

                chatId,

            ) {

                return await this.getMediaByType(

                    chatId,

                    "poll",

                );

            }

            //////////////////////////////////////////////////////
                // DELETE MESSAGE MEDIA
                //////////////////////////////////////////////////////

                async delete(

                    messageId,

                ) {

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

                //////////////////////////////////////////////////////
                // DELETE CHAT MEDIA
                //////////////////////////////////////////////////////

                async deleteChatMedia(

                    chatId,

                ) {

                    await db.query(

                        `
                        DELETE
                        FROM media_messages
                        WHERE chat_id = $1
                        `,

                        [

                            chatId,

                        ],

                    );

                }

                //////////////////////////////////////////////////////
                // UPDATE MEDIA
                //////////////////////////////////////////////////////

                async updateMedia({

                    messageId,

                    fileName,

                    originalName,

                    filePath,

                    fileUrl,

                    mimeType,

                    fileSize,

                    duration,

                    thumbnailUrl,

                }) {

                    const result = await db.query(

                        `
                        UPDATE media_messages

                        SET

                            file_name = COALESCE($2,file_name),

                            original_name = COALESCE($3,original_name),

                            file_path = COALESCE($4,file_path),

                            file_url = COALESCE($5,file_url),

                            mime_type = COALESCE($6,mime_type),

                            file_size = COALESCE($7,file_size),

                            duration = COALESCE($8,duration),

                            thumbnail_url = COALESCE($9,thumbnail_url)

                        WHERE message_id = $1

                        RETURNING *;
                        `,

                        [

                            messageId,

                            fileName,

                            originalName,

                            filePath,

                            fileUrl,

                            mimeType,

                            fileSize,

                            duration,

                            thumbnailUrl,

                        ],

                    );

                    return result.rows[0] || null;

                }

                //////////////////////////////////////////////////////
                // EXISTS
                //////////////////////////////////////////////////////

                async exists(

                    messageId,

                ) {

                    const result = await db.query(

                        `
                        SELECT 1
                        FROM media_messages
                        WHERE message_id = $1
                        LIMIT 1
                        `,

                        [

                            messageId,

                        ],

                    );

                    return result.rowCount > 0;

                }

                //////////////////////////////////////////////////////
                // COUNT CHAT MEDIA
                //////////////////////////////////////////////////////

                async countChatMedia(

                    chatId,

                ) {

                    const result = await db.query(

                        `
                        SELECT COUNT(*)::INTEGER AS total
                        FROM media_messages
                        WHERE chat_id = $1
                        `,

                        [

                            chatId,

                        ],

                    );

                    return result.rows[0].total;

                }

            }

            module.exports =
            new MediaMessageService();