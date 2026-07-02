const pool = require("../../config/db");

const eventDispatcher =
require("../../realtime/eventDispatcher");

const createChat = async (req, res) => {

    try {

        const {

            user_one_id,

            user_two_id,

        } = req.body;

        if (

            !user_one_id ||

            !user_two_id

        ) {

            return res.status(400).json({

                success: false,

                error: "Missing required fields",

            });

        }

        //////////////////////////////////////////////////////
        // CHECK IF CHAT EXISTS
        //////////////////////////////////////////////////////

        const existingChat =

            await pool.query(

                `
                SELECT *
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

                    user_one_id,

                    user_two_id,

                ],

            );

        if (existingChat.rows.length > 0) {

            return res.json({

                success: true,

                chat: existingChat.rows[0],

            });

        }

        //////////////////////////////////////////////////////
        // CREATE CHAT
        //////////////////////////////////////////////////////

        const result =

            await pool.query(

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
                RETURNING *
                `,

                [

                    user_one_id,

                    user_two_id,

                ],

            );

        const chat = result.rows[0];

        //////////////////////////////////////////////////////
        // REALTIME UPDATE
        //////////////////////////////////////////////////////

        eventDispatcher.chat({

            type: "chat-created",

            receiverId: user_one_id,

            chat,

        });

        eventDispatcher.chat({

            type: "chat-created",

            receiverId: user_two_id,

            chat,

        });

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(201).json({

            success: true,

            chat,

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

module.exports = createChat;