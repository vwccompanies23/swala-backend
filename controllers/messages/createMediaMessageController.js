const pool =
require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const createMediaMessage = async (req, res) => {

    try {

        //////////////////////////////////////////////////////
        // BODY
        //////////////////////////////////////////////////////

        const {

            sender_id,

            receiver_id,

            message = "",

            message_type = "document",

            media_url,

            thumbnail_url = "",

            file_name = "",

            original_name = "",

            mime_type = "",

            file_size = 0,

            duration = 0,

            reply_to = null,

        } = req.body;

        //////////////////////////////////////////////////////
        // VALIDATION
        //////////////////////////////////////////////////////

        if (

            !sender_id ||

            !receiver_id ||

            !media_url

        ) {

            return res.status(400).json({

                success: false,

                error: "Missing required fields.",

            });

        }

        //////////////////////////////////////////////////////
        // FIND CHAT
        //////////////////////////////////////////////////////

        let chat = await pool.query(

            `
            SELECT id
            FROM chats
            WHERE

            (

                user_one_id = $1

                AND user_two_id = $2

            )

            OR

            (

                user_one_id = $2

                AND user_two_id = $1

            )

            LIMIT 1
            `,

            [

                sender_id,

                receiver_id,

            ],

        );

        let chatId;

        //////////////////////////////////////////////////////
                // CREATE CHAT IF NEEDED
                //////////////////////////////////////////////////////

                if (chat.rows.length === 0) {

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

                        ],

                    );

                    chatId =

                        created.rows[0].id;

                }

                else {

                    chatId =

                        chat.rows[0].id;

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

                        sender_id,

                        message,

                        message_type,

                        media_url,

                        thumbnail_url,

                        file_name,

                        file_size,

                        duration,

                        reply_to,

                    ],

                );

                const createdMessage =

                    inserted.rows[0];

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

                                ON u.id = m.sender_id

                                WHERE m.id = $1
                                `,

                                [

                                    createdMessage.id,

                                ],

                            );

                            const messageData =

                                fullMessage.rows[0];

                            //////////////////////////////////////////////////////
                            // MEDIA TYPE
                            //////////////////////////////////////////////////////

                            messageData.media_type =
                                messageData.message_type;

                                messageData.message_type =
                                    message_type;

                            //////////////////////////////////////////////////////
                            // FILE INFORMATION
                            //////////////////////////////////////////////////////

                            messageData.file_url =

                                messageData.media_url;

                            messageData.original_name =

                                original_name;

                            messageData.mime_type =

                                mime_type;

                            messageData.thumbnail_url =

                                thumbnail_url;

                            messageData.duration =

                                duration;

                            //////////////////////////////////////////////////////
                            // IMAGE
                            //////////////////////////////////////////////////////

                            messageData.is_image_message =

                                message_type === "image";

                            messageData.image_path =

                                message_type === "image"

                                    ? media_url

                                    : "";

                            //////////////////////////////////////////////////////
                            // VIDEO
                            //////////////////////////////////////////////////////

                            messageData.is_video_message =

                                message_type === "video";

                            messageData.video_path =

                                message_type === "video"

                                    ? media_url

                                    : "";

                            //////////////////////////////////////////////////////
                            // VOICE
                            //////////////////////////////////////////////////////

                            messageData.is_voice_message =

                                message_type === "voice";

                            //////////////////////////////////////////////////////
                            // AUDIO
                            //////////////////////////////////////////////////////

                            messageData.is_audio_message =

                                message_type === "audio";

                            messageData.audio_path =

                                message_type === "voice" ||

                                message_type === "audio"

                                    ? media_url

                                    : "";

                            //////////////////////////////////////////////////////
                            // DOCUMENT
                            //////////////////////////////////////////////////////

                            messageData.is_document_message =

                                message_type === "document";

                            messageData.document_path =

                                message_type === "document"

                                    ? media_url

                                    : "";

                            //////////////////////////////////////////////////////
                            // COMPLETE MEDIA OBJECT
                            //////////////////////////////////////////////////////

                           messageData.media = {

                               type: message_type,

                               fileName: file_name,

                               originalName: original_name,

                               path: media_url,

                               url: media_url,

                               mimeType: mime_type,

                               size: file_size,

                               duration,

                               thumbnail: thumbnail_url,

                           };

                            //////////////////////////////////////////////////////
                                    // SEND TO RECEIVER
                                    //////////////////////////////////////////////////////

                                    eventDispatcher.chat({

                                        receiverId: receiver_id,

                                        message: messageData,

                                    });

                                    //////////////////////////////////////////////////////
                                    // SEND TO SENDER
                                    //////////////////////////////////////////////////////

                                    eventDispatcher.chat({

                                        receiverId: sender_id,

                                        message: messageData,

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

                                    console.error(

                                        "Create Media Message Error:",

                                        error,

                                    );

                                    return res.status(500).json({

                                        success: false,

                                        error: error.message,

                                    });

                                }

                            };

                            module.exports =
                            createMediaMessage;