const pool =
require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const getMessages = async (req, res) => {

    try {

        //////////////////////////////////////////////////////
        // PARAMS
        //////////////////////////////////////////////////////

        const {

            chat_id,

        } = req.params;

        const {

            userId,

        } = req.query;

        //////////////////////////////////////////////////////
        // VALIDATION
        //////////////////////////////////////////////////////

        if (!chat_id) {

            return res.status(400).json({

                success: false,

                error: "Chat ID is required.",

            });

        }

        //////////////////////////////////////////////////////
        // LOAD ALL MESSAGES
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

        //////////////////////////////////////////////////////
        // BUILD COMPLETE MESSAGE OBJECT
        //////////////////////////////////////////////////////

        const messages = result.rows.map(

            (message) => {

const type =

                    (
                        message.message_type ||
                        message.media_type ||
                        "text"
                    ).toLowerCase();

                const mediaUrl =

                    message.media_url ||

                    message.file_url ||

                    "";

                return {

                    ////////////////////////////////////////////////////
                    // ORIGINAL DATA
                    ////////////////////////////////////////////////////

                    ...message,

                    ////////////////////////////////////////////////////
                    // MEDIA TYPE
                    ////////////////////////////////////////////////////

                    message_type: type,

                    media_type: type,

                    ////////////////////////////////////////////////////
                    // MEDIA URL
                    ////////////////////////////////////////////////////

                    media_url: mediaUrl,

                    file_url: mediaUrl,

                    ////////////////////////////////////////////////////
                    // FILES
                    ////////////////////////////////////////////////////

                    file_name:

                        message.file_name ||

                        "",

                    original_name:

                        message.original_name ||

                        "",

                    mime_type:

                        message.mime_type ||

                        "",

                    file_size:

                        message.file_size ||

                        0,

                    duration:

                        message.duration ||

                        0,

                    thumbnail_url:

                        message.thumbnail_url ||

                        "",

                    ////////////////////////////////////////////////////
                    // IMAGE
                    ////////////////////////////////////////////////////

                    is_image_message:

                        type === "image",

                    image_path:

                        type === "image"

                            ? mediaUrl

                            : "",

                    ////////////////////////////////////////////////////
                    // VIDEO
                    ////////////////////////////////////////////////////

                    is_video_message:

                        type === "video",

                    video_path:

                        type === "video"

                            ? mediaUrl

                            : "",

                    ////////////////////////////////////////////////////
                    // VOICE
                    ////////////////////////////////////////////////////

                    is_voice_message:

                        type === "voice",

                    ////////////////////////////////////////////////////
                    // AUDIO
                    ////////////////////////////////////////////////////

                    is_audio_message:

                        type === "audio",

                    audio_path:

                        type === "voice" ||

                        type === "audio"

                            ? mediaUrl

                            : "",

                    ////////////////////////////////////////////////////
                    // DOCUMENT
                    ////////////////////////////////////////////////////

                    is_document_message:

                        type === "document",

                    document_path:

                        type === "document"

                            ? mediaUrl

                            : "",


            ////////////////////////////////////////////////////
                                // GIF
                                ////////////////////////////////////////////////////

                                is_gif_message:
                                    type === "gif",

                                ////////////////////////////////////////////////////
                                // STICKER
                                ////////////////////////////////////////////////////

                                is_sticker_message:
                                    type === "sticker",

                                ////////////////////////////////////////////////////
                                // LOCATION
                                ////////////////////////////////////////////////////

                                is_location_message:
                                    type === "location",

                                latitude:
                                    Number(message.latitude || 0),

                                longitude:
                                    Number(message.longitude || 0),

                                ////////////////////////////////////////////////////
                                // CONTACT
                                ////////////////////////////////////////////////////

                                is_contact_message:
                                    type === "contact",

                                contact_name:
                                    message.contact_name || "",

                                contact_phone:
                                    message.contact_phone || "",

                                ////////////////////////////////////////////////////
                                // POLL
                                ////////////////////////////////////////////////////

                                is_poll_message:
                                    type === "poll",

                                poll_question:
                                    message.poll_question || "",

                                poll_options:
                                    message.poll_options || [],

                                ////////////////////////////////////////////////////
                                // LINK
                                ////////////////////////////////////////////////////

                                is_link_message:
                                    type === "link",

                                link_url:
                                    message.link_url || "",

                                link_title:
                                    message.link_title || "",

                                link_description:
                                    message.link_description || "",

                                link_image:
                                    message.link_image || "",

                                ////////////////////////////////////////////////////
                                // STATUS
                                ////////////////////////////////////////////////////

                                is_seen:
                                    message.is_seen ??
                                    message.is_read ??
                                    false,

                                is_delivered:
                                    message.is_delivered ??
                                    false,

                                is_deleted_for_everyone:
                                    message.is_deleted_for_everyone ??
                                    false,

                                ////////////////////////////////////////////////////
                                // COMPLETE MEDIA
                                ////////////////////////////////////////////////////

                                media:

                                    type !== "text"

                                        ? {

                                            type,

                                            fileName:
                                                message.file_name,

                                            originalName:
                                                message.original_name,

                                            path:
                                                message.file_path,

                                            url:
                                                mediaUrl,

                                            mimeType:
                                                message.mime_type,

                                            size:
                                                message.file_size,

                                            duration:
                                                message.duration || 0,

                                            thumbnail:
                                                message.thumbnail_url || "",

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
                                        AND COALESCE(is_delivered,FALSE)=FALSE
                                    `,

                                    [

                                        chat_id,

                                        userId,

                                    ],

                                );

                                //////////////////////////////////////////////////////
                                // NOTIFY SENDERS
                                //////////////////////////////////////////////////////

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

                                            chatId: Number(chat_id),

                                        },

                                    });

                                }

                            }

                            //////////////////////////////////////////////////////
                            // RESPONSE
                            //////////////////////////////////////////////////////

                            return res.status(200).json({

                                success: true,

                                count: messages.length,

                                messages,

                            });

                        }

                        catch (error) {

                            console.error(

                                "Get Messages Error:",

                                error,

                            );

                            return res.status(500).json({

                                success: false,

                                error: error.message,

                            });

                        }

                    };

                    module.exports = getMessages;