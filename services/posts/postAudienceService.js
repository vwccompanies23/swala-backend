const pool = require("../../config/db");

const getAudience = async (userId) => {

    const audience = new Set();

    //////////////////////////////////////////////////////
    // CONTACTS
    //////////////////////////////////////////////////////

    const contacts = await pool.query(
        `
        SELECT contact_user_id
        FROM contacts
        WHERE user_id = $1
        `,
        [userId],
    );

    contacts.rows.forEach((row) => {
        audience.add(Number(row.contact_user_id));
    });

    //////////////////////////////////////////////////////
    // CHATS
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
        [userId],
    );

    chats.rows.forEach((row) => {
        audience.add(Number(row.user_id));
    });

    //////////////////////////////////////////////////////
    // INCLUDE OWNER
    //////////////////////////////////////////////////////

    audience.add(Number(userId));

    return [...audience];

};

module.exports = {
    getAudience,
};