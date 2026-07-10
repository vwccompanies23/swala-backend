const pool = require("../../config/db");

const normalizePhone = (phone) => {

    return (phone || "")

        .replace(/\D/g, "");

};

const syncContacts = async (req, res) => {

    try {

        const {

            user_id,

            contacts,

        } = req.body;

        //////////////////////////////////////////////////////
        // VALIDATION
        //////////////////////////////////////////////////////

        if (!user_id) {

            return res.status(400).json({

                success: false,

                error: "user_id is required",

            });

        }

        if (!Array.isArray(contacts)) {

            return res.status(400).json({

                success: false,

                error: "contacts array required",

            });

        }

        //////////////////////////////////////////////////////
        // REMOVE OLD CONTACTS
        //////////////////////////////////////////////////////

        await pool.query(

            `
            DELETE FROM contacts
            WHERE user_id = $1
            `,

            [

                user_id,

            ],

        );

        //////////////////////////////////////////////////////
        // NORMALIZE CONTACTS
        //////////////////////////////////////////////////////

        const normalizedContacts = contacts.map(contact => ({

            name:

            contact.name,

            phone:

            contact.phone,

            normalized:

            normalizePhone(contact.phone),

        }));

        const phoneNumbers =

            normalizedContacts.map(

                c => c.normalized,

            );

        //////////////////////////////////////////////////////
        // FIND SWALA USERS
        //////////////////////////////////////////////////////

        const users = await pool.query(

            `
            SELECT

                id,

                full_name,

                username,

                phone,

                profile_image

            FROM users

            WHERE

            regexp_replace(

                phone,

                '[^0-9]',

                '',

                'g'

            ) = ANY($1)
            `,

            [

                phoneNumbers,

            ],

        );

        //////////////////////////////////////////////////////
        // CREATE LOOKUP
        //////////////////////////////////////////////////////

        const userMap = new Map();

        for (const user of users.rows) {

            userMap.set(

                normalizePhone(

                    user.phone,

                ),

                user,

            );

        }

        //////////////////////////////////////////////////////
        // SAVE CONTACTS
        //////////////////////////////////////////////////////

        const swalaUsers = [];

        const inviteContacts = [];

        for (const contact of normalizedContacts) {

            if (

                userMap.has(

                    contact.normalized,

                )

            ) {

                const matchedUser =

                    userMap.get(

                        contact.normalized,

                    );

                //////////////////////////////////////////////////////
                // DON'T SAVE YOURSELF
                //////////////////////////////////////////////////////

                if (

                    Number(matchedUser.id) !==

                    Number(user_id)

                ) {

                    await pool.query(

                        `
                        INSERT INTO contacts
                        (

                            user_id,

                            contact_user_id,

                            contact_name,

                            phone

                        )

                        VALUES
                        (

                            $1,

                            $2,

                            $3,

                            $4

                        )

                        ON CONFLICT
                        (

                            user_id,

                            contact_user_id

                        )

                        DO UPDATE SET

                        contact_name = EXCLUDED.contact_name,

                        phone = EXCLUDED.phone
                        `,

                        [

                            user_id,

                            matchedUser.id,

                            contact.name,

                            contact.phone,

                        ],

                    );

                }

                swalaUsers.push({

                    ...matchedUser,

                    contact_name:

                    contact.name,

                });

            }

            else {

                inviteContacts.push({

                    name:

                    contact.name,

                    phone:

                    contact.phone,

                });

            }

        }

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            totalSwalaUsers:

            swalaUsers.length,

            totalInvites:

            inviteContacts.length,

            swalaUsers,

            inviteContacts,

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

module.exports = syncContacts;