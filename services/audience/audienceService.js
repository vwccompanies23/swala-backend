const pool = require("../../config/db");

//////////////////////////////////////////////////////
// GET STATUS / POST AUDIENCE
//////////////////////////////////////////////////////

const getAudience = async (userId) => {

    const audience = new Map();

    //////////////////////////////////////////////////////
    // CONTACTS
    //////////////////////////////////////////////////////

    const contacts = await pool.query(

        `
        SELECT
            u.id,
            u.full_name,
            u.username,
            u.phone,
            u.profile_image
        FROM contacts c
        JOIN users u
        ON u.id = c.contact_user_id
        WHERE c.user_id = $1
        `,

        [userId],

    );

    contacts.rows.forEach((user) => {

        audience.set(user.id, user);

    });

    //////////////////////////////////////////////////////
    // CHATS
    //////////////////////////////////////////////////////

    const chats = await pool.query(

        `
        SELECT DISTINCT

            u.id,
            u.full_name,
            u.username,
            u.phone,
            u.profile_image

        FROM chats c

        JOIN users u

        ON u.id =

        CASE

            WHEN c.user_one_id = $1

            THEN c.user_two_id

            ELSE c.user_one_id

        END

        WHERE

            c.user_one_id = $1

            OR

            c.user_two_id = $1
        `,

        [userId],

    );

    chats.rows.forEach((user) => {

        audience.set(user.id, user);

    });

    //////////////////////////////////////////////////////
    // CALLS
    //////////////////////////////////////////////////////

    const calls = await pool.query(

        `
        SELECT DISTINCT

            u.id,
            u.full_name,
            u.username,
            u.phone,
            u.profile_image

        FROM calls c

        JOIN users u

        ON u.id =

        CASE

            WHEN c.caller_id = $1

            THEN c.receiver_id

            ELSE c.caller_id

        END

        WHERE

            c.caller_id = $1

            OR

            c.receiver_id = $1
        `,

        [userId],

    );

    calls.rows.forEach((user) => {

        audience.set(user.id, user);

    });

    //////////////////////////////////////////////////////
    // INCLUDE MYSELF
    //////////////////////////////////////////////////////

    const me = await pool.query(

        `
        SELECT
            id,
            full_name,
            username,
            phone,
            profile_image
        FROM users
        WHERE id = $1
        `,

        [userId],

    );

    if (me.rows.length) {

        audience.set(

            me.rows[0].id,

            me.rows[0],

        );

    }

    return [...audience.values()];

};

//////////////////////////////////////////////////////
// CHECK CONTACT
//////////////////////////////////////////////////////

const isContact = async (

    ownerId,

    viewerId,

) => {

    const result = await pool.query(

        `
        SELECT id
        FROM contacts
        WHERE
        user_id = $1
        AND contact_user_id = $2
        LIMIT 1
        `,

        [

            ownerId,

            viewerId,

        ],

    );

    return result.rows.length > 0;

};

//////////////////////////////////////////////////////
// MUTUAL CONTACT
//////////////////////////////////////////////////////

const isMutualContact = async (

    ownerId,

    viewerId,

) => {

    const result = await pool.query(

        `
        SELECT 1

        FROM contacts a

        JOIN contacts b

        ON a.contact_user_id = b.user_id

        WHERE

        a.user_id = $1

        AND

        a.contact_user_id = $2

        AND

        b.contact_user_id = $1

        LIMIT 1
        `,

        [

            ownerId,

            viewerId,

        ],

    );

    return result.rows.length > 0;

};

module.exports = {

    getAudience,

    isContact,

    isMutualContact,

};