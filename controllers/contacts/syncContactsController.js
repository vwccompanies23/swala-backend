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

    // Remove spaces, dashes, brackets...
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
        // DEBUG
        //////////////////////////////////////////////////////

        console.log("================================");
        console.log("SYNC CONTACTS");
        console.log("User ID:", user_id);
        console.log("Contacts Received:", contacts?.length || 0);

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

            name: contact.name || "",

            phone: normalizePhone(
                contact.phone,
            ),

        }));

        //////////////////////////////////////////////////////
        // LOAD ALL USERS
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

        console.log(
            "Users in database:",
            users.rows.length,
        );

        //////////////////////////////////////////////////////
        // SAVE CONTACTS
        //////////////////////////////////////////////////////

        const swalaUsers = [];
        const inviteContacts = [];

        for (const contact of normalizedContacts) {

            const contactDigits =
                contact.phone.replace(/\D/g, "");

            let matchedUser = null;

            //////////////////////////////////////////////////////
            // WORLDWIDE MATCH
            //////////////////////////////////////////////////////

            for (const user of users.rows) {

                const userPhone =
                    normalizePhone(user.phone);

                const userDigits =
                    userPhone.replace(/\D/g, "");

                if (

                    userDigits === contactDigits ||

                    userDigits.endsWith(contactDigits) ||

                    contactDigits.endsWith(userDigits)

                ) {

                    matchedUser = user;
                    break;

                }

            }

            console.log(
                contact.phone,
                "=>",
                matchedUser
                    ? matchedUser.phone
                    : "NO MATCH",
            );

            //////////////////////////////////////////////////////
            // FOUND SWALA USER
            //////////////////////////////////////////////////////

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

                        contact_name =
                        EXCLUDED.contact_name
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

            }

            //////////////////////////////////////////////////////
            // NOT USING SWALA
            //////////////////////////////////////////////////////

            else {

                inviteContacts.push({

                    name: contact.name,

                    phone: contact.phone,

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