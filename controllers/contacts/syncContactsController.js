const pool = require("../../config/db");

//////////////////////////////////////////////////////
// NORMALIZE PHONE (WORLDWIDE)
//////////////////////////////////////////////////////

const normalizePhone = (phone) => {

    if (!phone) {
        return "";
    }

    let value = phone.toString().trim();

    // Convert 00 prefix to +
    if (value.startsWith("00")) {
        value = "+" + value.substring(2);
    }

    // Keep only digits and +
    value = value.replace(/[^\d+]/g, "");

    // Allow only one +
    if (value.startsWith("+")) {
        value =
            "+" +
            value.substring(1).replace(/\+/g, "");
    } else {
        value = value.replace(/\+/g, "");
    }

    return value;
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
            [user_id],
        );

        //////////////////////////////////////////////////////
        // NORMALIZE CONTACTS
        //////////////////////////////////////////////////////

        const normalizedContacts = contacts.map(contact => ({

            name: contact.name,

            phone: normalizePhone(
                contact.phone,
            ),

        }));

        const phoneNumbers =
            normalizedContacts.map(
                c => c.phone,
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
                profile_image,
                bio,
                is_online
            FROM users
            `,
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

            const matchedUser =
                userMap.get(contact.phone);

            if (matchedUser) {

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
                            contact_name
                        )
                        VALUES
                        (
                            $1,
                            $2,
                            $3
                        )
                        ON CONFLICT
                        (
                            user_id,
                            contact_user_id
                        )
                        DO UPDATE SET
                        contact_name = EXCLUDED.contact_name
                        `,
                        [
                            user_id,
                            matchedUser.id,
                            contact.name,
                        ],
                    );

                    swalaUsers.push({

                        id: matchedUser.id,

                        full_name:
                            matchedUser.full_name,

                        username:
                            matchedUser.username,

                        phone:
                            matchedUser.phone,

                        profile_image:
                            matchedUser.profile_image,

                        bio:
                            matchedUser.bio,

                        is_online:
                            matchedUser.is_online,

                        contact_name:
                            contact.name,

                    });

                }

            } else {

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