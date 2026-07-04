const pool = require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const {
    sendNotification,
} = require("../../firebase/notificationService");

const createMessage = async (req, res) => {

    try {

        const {

            sender_id,

            receiver_id,

            message,

        } = req.body;

        if (

            !sender_id ||

            !receiver_id ||

            !message

        ) {

            return res.status(400).json({

                success: false,

                error: "Missing required fields",

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
                message
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            RETURNING *
            `,

            [

                chatId,

                sender_id,

                message,

            ],

        );

        //////////////////////////////////////////////////////
        // LOAD COMPLETE MESSAGE
        //////////////////////////////////////////////////////

        const fullMessage = await pool.query(

            `
            SELECT

                m.id,

                m.chat_id,

                m.sender_id,

                u.full_name AS sender_name,

                u.username,

                u.profile_image,

                m.message,

                m.is_read,

                m.is_delivered,

                m.created_at

            FROM messages m

            JOIN users u

            ON u.id = m.sender_id

            WHERE m.id = $1
            `,

            [

                inserted.rows[0].id,

            ],

        );

        const messageData =

            fullMessage.rows[0];

        //////////////////////////////////////////////////////
        // REALTIME RECEIVER
        //////////////////////////////////////////////////////

        eventDispatcher.chat({

            receiverId: receiver_id,

            ...messageData,

        });

        //////////////////////////////////////////////////////
        // REALTIME SENDER
        //////////////////////////////////////////////////////

        eventDispatcher.chat({

            receiverId: sender_id,

            ...messageData,

        });

        //////////////////////////////////////////////////////
        // PUSH NOTIFICATION
        //////////////////////////////////////////////////////

        try {

           await sendNotification({

               userId: receiver_id,

               title: messageData.sender_name,

               body: message,

               data: {

                   //////////////////////////////////////////////////////
                   // NOTIFICATION TYPE
                   //////////////////////////////////////////////////////

                   type: "message",

                   //////////////////////////////////////////////////////
                   // CHAT
                   //////////////////////////////////////////////////////

                   chatId: chatId.toString(),

                   //////////////////////////////////////////////////////
                   // USERS
                   //////////////////////////////////////////////////////

                   senderId: sender_id.toString(),

                   receiverId: receiver_id.toString(),

                   senderName: messageData.sender_name,

                   senderUsername: messageData.username,

                   senderPhoto: messageData.profile_image ?? "",

                   //////////////////////////////////////////////////////
                   // MESSAGE
                   //////////////////////////////////////////////////////

                   messageId: messageData.id.toString(),

                   message: message,

                   createdAt: messageData.created_at.toString(),

                   //////////////////////////////////////////////////////
                   // APP
                   //////////////////////////////////////////////////////

                   click_action: "FLUTTER_NOTIFICATION_CLICK",

                   screen: "chat",

               },

           });

        }

        catch (error) {

            console.error(error);

        }

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

module.exports = createMessage;