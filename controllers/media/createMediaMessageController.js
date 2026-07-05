const path = require("path");

const pool = require("../../config/db");

const mediaMessageService =
require("../../services/media/mediaMessageService");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const createMediaMessageController = async (req, res) => {

    try {

        //////////////////////////////////////////////////////
        // FILE REQUIRED
        //////////////////////////////////////////////////////

        if (!req.file) {

            return res.status(400).json({

                success: false,

                error: "No media uploaded.",

            });

        }

        //////////////////////////////////////////////////////
        // BODY
        //////////////////////////////////////////////////////

        const {

            chatId,

            senderId,

            receiverId,

            mediaType,

            message = "",

        } = req.body;

        if (!chatId || !senderId || !receiverId) {

            return res.status(400).json({

                success: false,

                error: "Missing required fields.",

            });

        }

        //////////////////////////////////////////////////////
        // DETECT MEDIA TYPE
        //////////////////////////////////////////////////////

        const mime =
            (req.file.mimetype || "").toLowerCase();

        const extension =
            path.extname(req.file.originalname)
            .toLowerCase();

        let detectedType =
            mediaType;

        if (!detectedType) {

            if (
                mime.startsWith("image/") ||
                [".jpg",".jpeg",".png",".gif",".bmp",".webp",".heic",".heif",".jfif",".avif",".svg"]
                .includes(extension)
            ) {

                detectedType = "image";

            }

            else if (
                mime.startsWith("video/") ||
                [".mp4",".mov",".avi",".mkv",".3gp",".webm",".m4v"]
                .includes(extension)
            ) {

                detectedType = "video";

            }

            else if (
                mime.startsWith("audio/") ||
                mime === "application/octet-stream"
            ) {

                if (
                    [".opus",".aac",".m4a",".amr"]
                    .includes(extension)
                ) {

                    detectedType = "voice";

                } else {

                    detectedType = "audio";

                }

            }

            else {

                detectedType = "document";

            }

        }

        //////////////////////////////////////////////////////
        // CREATE MESSAGE
        //////////////////////////////////////////////////////

        const messageResult =
        await pool.query(

            `
            INSERT INTO messages
            (
                chat_id,
                sender_id,
                message,
                created_at
            )
            VALUES
            (
                $1,$2,$3,NOW()
            )
            RETURNING *;
            `,

            [
                chatId,
                senderId,
                message,
            ],

        );

        const createdMessage =
        messageResult.rows[0];

        //////////////////////////////////////////////////////
        // FILE URL
        //////////////////////////////////////////////////////

        const baseUrl =
            process.env.BASE_URL ||
            `${req.protocol}://${req.get("host")}`;

        const fileUrl =
            `${baseUrl}/${req.file.path.replace(/\\/g,"/")}`;

        //////////////////////////////////////////////////////
        // SAVE MEDIA
        //////////////////////////////////////////////////////

        const media =
        await mediaMessageService.save({

            messageId:
            createdMessage.id,

            chatId,

            senderId,

            mediaType:
            detectedType,

            fileName:
            req.file.filename,

            originalName:
            req.file.originalname,

            filePath:
            req.file.path,

            fileUrl,

            mimeType:
            req.file.mimetype,

            fileSize:
            req.file.size,

        });

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.chat({

            receiverId,

            message: {

                ...createdMessage,

                media,

            },

        });

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(201).json({

            success: true,

            message: {

                ...createdMessage,

                media,

            },

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
createMediaMessageController;