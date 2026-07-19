const pool = require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const {
    sendNotification,
} = require("../../firebase/notificationService");

const createSecretInvitationMessage = async (req, res) => {

    try {

        const {

            sender_id,

            receiver_id,

            invitation_id,

        } = req.body;

        //////////////////////////////////////////////////////
        // VALIDATION
        //////////////////////////////////////////////////////

        if (

            !sender_id ||

            !receiver_id ||

            !invitation_id

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

        }

        else {

            chatId = chat.rows[0].id;

        }

        //////////////////////////////////////////////////////
        // CREATE INVITATION MESSAGE
        //////////////////////////////////////////////////////

        const inserted = await pool.query(

            `
            INSERT INTO messages
            (

                chat_id,

                sender_id,

                message,

                message_type,

                invitation_id

            )

            VALUES
            (

                $1,

                $2,

                '',

                'secret_invitation',

                $3

            )

            RETURNING *

            `,

            [

                chatId,

                sender_id,

                invitation_id,

            ],

        );

        //////////////////////////////////////////////////////
        // LOAD FULL MESSAGE
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

                inserted.rows[0].id,

            ],

        );

        const message =

            fullMessage.rows[0];

        //////////////////////////////////////////////////////
        // REALTIME
        //////////////////////////////////////////////////////

        eventDispatcher.chat({

            receiverId: receiver_id,

            ...message,

        });

        eventDispatcher.chat({

            receiverId: sender_id,

            ...message,

        });

        //////////////////////////////////////////////////////
        // PUSH NOTIFICATION
        //////////////////////////////////////////////////////

        try {

            await sendNotification({

                userId: receiver_id,

                title: "🔒 Secret Chat Invitation",

                body: `${message.sender_name} invited you to Secret Chat.`,

                data: {

                    type:

                    "secret_invitation",

                    invitationId:

                    invitation_id,

                    chatId:

                    chatId.toString(),

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

            message,

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
createSecretInvitationMessage;