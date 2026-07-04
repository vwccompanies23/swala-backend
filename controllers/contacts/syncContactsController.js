const pool = require("../../config/db");

const normalizePhone = (phone) => {
    return (phone || "").replace(/\D/g, "");
};

const syncContacts = async (req, res) => {

    try {

        const { contacts } = req.body;

        if (!Array.isArray(contacts)) {

            return res.status(400).json({

                success: false,

                error: "contacts array required",

            });

        }

        //////////////////////////////////////////////////////
        // NORMALIZE CONTACTS
        //////////////////////////////////////////////////////

        const normalizedContacts = contacts.map(contact => ({

            name: contact.name,

            phone: contact.phone,

            normalized: normalizePhone(contact.phone),

        }));

        const phoneNumbers = normalizedContacts.map(

            c => c.normalized,

        );

        //////////////////////////////////////////////////////
        // SEARCH ONLY CONTACT NUMBERS
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
            WHERE regexp_replace(phone,'[^0-9]','','g')
            = ANY($1)
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

                normalizePhone(user.phone),

                user,

            );

        }

        //////////////////////////////////////////////////////
        // BUILD RESPONSE
        //////////////////////////////////////////////////////

        const swalaUsers = [];

        const inviteContacts = [];

        for (const contact of normalizedContacts) {

            if (userMap.has(contact.normalized)) {

                swalaUsers.push({

                    ...userMap.get(contact.normalized),

                    contact_name: contact.name,

                });

            } else {

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