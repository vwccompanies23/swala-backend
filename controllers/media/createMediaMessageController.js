const path = require("path");

const pool =
require("../../config/db");

const mediaMessageService =
require("../../services/media/mediaMessageService");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const createMediaMessageController =
async (req, res) => {

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

            duration = 0,

            thumbnailUrl = "",

            replyTo = null,

        } = req.body;

        //////////////////////////////////////////////////////
        // VALIDATION
        //////////////////////////////////////////////////////

        if (

            !chatId ||

            !senderId ||

            !receiverId

        ) {

            return res.status(400).json({

                success: false,

                error: "Missing required fields.",

            });

        }

        //////////////////////////////////////////////////////
        // FILE
        //////////////////////////////////////////////////////

        const file = req.file;

        const mime =

            (file.mimetype || "")
            .toLowerCase();

        const extension =

            path.extname(

                file.originalname,

            ).toLowerCase();

        //////////////////////////////////////////////////////
        // DETECT TYPE
        //////////////////////////////////////////////////////

        let detectedType = mediaType;

        //////////////////////////////////////////////////////
                // AUTO DETECT IMAGE
                //////////////////////////////////////////////////////

                if (!detectedType) {

                    if (

                        mime.startsWith("image/") ||

                        [

                            ".jpg",
                            ".jpeg",
                            ".png",
                            ".gif",
                            ".bmp",
                            ".webp",
                            ".heic",
                            ".heif",
                            ".jfif",
                            ".avif",
                            ".svg",
                            ".tif",
                            ".tiff",
                            ".ico"

                        ].includes(extension)

                    ) {

                        detectedType = "image";

                    }

                }

                //////////////////////////////////////////////////////
                // AUTO DETECT VIDEO
                //////////////////////////////////////////////////////

                if (!detectedType) {

                    if (

                        mime.startsWith("video/") ||

                        [

                            ".mp4",
                            ".mov",
                            ".avi",
                            ".mkv",
                            ".3gp",
                            ".webm",
                            ".m4v",
                            ".flv",
                            ".wmv",
                            ".mpeg",
                            ".mpg",
                            ".ts"

                        ].includes(extension)

                    ) {

                        detectedType = "video";

                    }

                }

                //////////////////////////////////////////////////////
                // AUTO DETECT AUDIO / VOICE
                //////////////////////////////////////////////////////

                if (!detectedType) {

                    if (

                        mime.startsWith("audio/") ||

                        mime === "application/octet-stream"

                    ) {

                        if (

                            [

                                ".opus",
                                ".amr",
                                ".aac",
                                ".m4a",
                                ".oga",
                                ".ogg"

                            ].includes(extension)

                        ) {

                            detectedType = "voice";

                        }

                        else {

                            detectedType = "audio";

                        }

                    }

                }

                //////////////////////////////////////////////////////
                // EVERYTHING ELSE IS A DOCUMENT
                //////////////////////////////////////////////////////

                if (!detectedType) {

                    detectedType = "document";

                }

                //////////////////////////////////////////////////////
                // FILE URL
                //////////////////////////////////////////////////////

                const baseUrl =

                    process.env.BASE_URL ||

                    `${req.protocol}://${req.get("host")}`;

                const fileUrl =

                    `${baseUrl}/${file.path.replace(/\\/g, "/")}`;

                    //////////////////////////////////////////////////////
                            // SAVE MESSAGE
                            //////////////////////////////////////////////////////

                            const messageResult =

                            await pool.query(

                                `
                                INSERT INTO messages
                                (
                                    chat_id,
                                    sender_id,
                                    message,
                                    message_type,
                                    media_url,
                                    thumbnail_url,
                                    file_name,
                                    file_size,
                                    duration,
                                    reply_to,
                                    created_at
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
                                    NOW()
                                )
                                RETURNING *;
                                `,

                                [

                                    chatId,

                                    senderId,

                                    message,

                                    detectedType,

                                    fileUrl,

                                    thumbnailUrl,

                                    file.originalname,

                                    file.size,

                                    duration,

                                    replyTo,

                                ],

                            );

                            const createdMessage =

                                messageResult.rows[0];

                            //////////////////////////////////////////////////////
                            // SAVE MEDIA DETAILS
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
                                    file.filename,

                                originalName:
                                    file.originalname,

                                filePath:
                                    file.path.replace(/\\/g, "/"),

                                fileUrl,

                                mimeType:
                                    file.mimetype,

                                fileSize:
                                    file.size,

                            });

                            //////////////////////////////////////////////////////
                            // BUILD COMPLETE MESSAGE
                            //////////////////////////////////////////////////////

                            const fullMessage = {

                                ...createdMessage,

                                sender_name: "",

                                username: "",

                                profile_image: "",

                                media_type:
                                    detectedType,

                                media_url:
                                    fileUrl,

                                file_url:
                                    fileUrl,

                                file_name:
                                    file.filename,

                                original_name:
                                    file.originalname,

                                mime_type:
                                    file.mimetype,

                                file_size:
                                    file.size,

                                duration,

                                image_path:
                                    detectedType === "image"
                                        ? fileUrl
                                        : "",

                                video_path:
                                    detectedType === "video"
                                        ? fileUrl
                                        : "",

                                audio_path:
                                    detectedType === "audio" ||
                                    detectedType === "voice"
                                        ? fileUrl
                                        : "",

                                document_path:
                                    detectedType === "document"
                                        ? fileUrl
                                        : "",

                                is_image_message:
                                    detectedType === "image",

                                is_video_message:
                                    detectedType === "video",

                                is_voice_message:
                                    detectedType === "voice",

                                media,

                            };

                            //////////////////////////////////////////////////////
                                    // SEND REALTIME TO RECEIVER
                                    //////////////////////////////////////////////////////

                                    eventDispatcher.chat({

                                        receiverId,

                                        message: fullMessage,

                                    });

                                    //////////////////////////////////////////////////////
                                    // SEND REALTIME TO SENDER
                                    //////////////////////////////////////////////////////

                                    eventDispatcher.chat({

                                        receiverId: senderId,

                                        message: fullMessage,

                                    });

                                    //////////////////////////////////////////////////////
                                    // RESPONSE
                                    //////////////////////////////////////////////////////

                                    return res.status(201).json({

                                        success: true,

                                        message: fullMessage,

                                    });

                                }

                                catch (error) {

                                    console.error(

                                        "Create Media Message Error:",

                                        error,

                                    );

                                    return res.status(500).json({

                                        success: false,

                                        error: error.message,

                                        stack:
                                            process.env.NODE_ENV === "development"
                                                ? error.stack
                                                : undefined,

                                    });

                                }

                            };

                            module.exports =
                            createMediaMessageController;