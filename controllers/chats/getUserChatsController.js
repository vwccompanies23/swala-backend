const pool = require("../../config/db");

const getUserChats = async (req, res) => {

    try {

        const { userId } = req.params;

        if (!userId) {

            return res.status(400).json({

                success: false,

                error: "User ID is required",

            });

        }

        const result = await pool.query(

            `
            SELECT

                c.id AS chat_id,

                c.created_at,

                CASE
                    WHEN c.user_one_id = $1
                    THEN u2.id
                    ELSE u1.id
                END AS receiver_id,

                CASE
                    WHEN c.user_one_id = $1
                    THEN u2.full_name
                    ELSE u1.full_name
                END AS full_name,

                CASE
                    WHEN c.user_one_id = $1
                    THEN u2.username
                    ELSE u1.username
                END AS username,

                CASE
                    WHEN c.user_one_id = $1
                    THEN u2.profile_image
                    ELSE u1.profile_image
                END AS profile_image,

                CASE
                    WHEN c.user_one_id = $1
                    THEN u2.is_online
                    ELSE u1.is_online
                END AS is_online,

                CASE
                    WHEN c.user_one_id = $1
                    THEN u2.last_seen
                    ELSE u1.last_seen
                END AS last_seen,

                (
                    SELECT message
                    FROM messages
                    WHERE chat_id = c.id
                    ORDER BY created_at DESC
                    LIMIT 1
                ) AS last_message,

                (
                    SELECT created_at
                    FROM messages
                    WHERE chat_id = c.id
                    ORDER BY created_at DESC
                    LIMIT 1
                ) AS last_message_time,

                (
                    SELECT COUNT(*)
                    FROM messages
                    WHERE
                        chat_id = c.id
                        AND sender_id <>
                        $1
                        AND is_read = FALSE
                ) AS unread_count

            FROM chats c

            JOIN users u1
            ON c.user_one_id = u1.id

            JOIN users u2
            ON c.user_two_id = u2.id

            WHERE

                c.user_one_id = $1

                OR

                c.user_two_id = $1

            ORDER BY

                last_message_time DESC NULLS LAST,

                c.created_at DESC
            `,

            [

                userId,

            ],

        );

        return res.status(200).json({

            success: true,

            chats: result.rows,

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

module.exports = getUserChats;