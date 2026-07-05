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

        //////////////////////////////////////////////////////
        // CREATE MESSAGE
        //////////////////////////////////////////////////////

        const messageResult = await pool.query(

            `
            INSERT INTO messages (

                chat_id,

                sender_id,

                message,

                created_at

            )

            VALUES (

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
        // BUILD URL
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

                mediaType,

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

        return res.json({

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