const pool = require("../../config/db");

const getStatusesController = async (req, res) => {

    try {

        const { user_id } = req.query;

        //////////////////////////////////////////////////////
        // USER REQUIRED
        //////////////////////////////////////////////////////

        if (!user_id) {

            return res.status(400).json({

                success: false,

                error: "User ID is required",

            });

        }

        //////////////////////////////////////////////////////
        // USER EXISTS
        //////////////////////////////////////////////////////

        const userResult = await pool.query(

            `
            SELECT id
            FROM users
            WHERE id = $1
            LIMIT 1
            `,

            [user_id]

        );

        if (userResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                error: "User not found",

            });

        }

       //////////////////////////////////////////////////////
       // GET CONTACTS
       //////////////////////////////////////////////////////

       const contacts = await pool.query(
       `
       SELECT contact_user_id
       FROM contacts
       WHERE user_id = $1
       `,
       [user_id],
       );

       const audience = new Set(
       contacts.rows.map(
       row => Number(row.contact_user_id),
       ),
       );

       //////////////////////////////////////////////////////
       // GET CHAT USERS
       //////////////////////////////////////////////////////

       const chats = await pool.query(
       `
       SELECT
           CASE
               WHEN user_one_id = $1
               THEN user_two_id
               ELSE user_one_id
           END AS user_id
       FROM chats
       WHERE
           user_one_id = $1
           OR user_two_id = $1
       `,
       [user_id],
       );

       for (const chat of chats.rows) {

           audience.add(
               Number(chat.user_id),
           );

       }

       //////////////////////////////////////////////////////
       // INCLUDE MYSELF
       //////////////////////////////////////////////////////

       audience.add(Number(user_id));

       const contactIds = [...audience];

        //////////////////////////////////////////////////////
        // GET VISIBLE STATUSES
        //////////////////////////////////////////////////////

        const result = await pool.query(

            `
            SELECT

                s.*,

                u.full_name,

                u.username,

                u.profile_image,

                EXISTS(

                    SELECT 1

                    FROM status_views sv

                    WHERE

                        sv.status_id = s.id

                    AND

                        sv.viewer_id = $2

                ) AS is_viewed

            FROM statuses s

            JOIN users u

            ON u.id = s.user_id

            WHERE

                s.expires_at > NOW()

            AND

            (

                s.user_id = ANY($1)

                OR

                s.privacy = 'everyone'

            )

            ORDER BY

                s.created_at DESC
            `,

            [

                contactIds,

                user_id,

            ],

        );

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        console.log(
            "Returned statuses:",
            result.rows.map(s => ({
                id: s.id,
                user: s.user_id,
                caption: s.caption,
            })),
        );

        return res.json({

            success: true,

            total: result.rows.length,

            statuses: result.rows,

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

module.exports = getStatusesController;