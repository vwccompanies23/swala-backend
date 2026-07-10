const pool = require("../../config/db");

//////////////////////////////////////////////////////
// GET STATUS AUDIENCE
//////////////////////////////////////////////////////

const getAudience = async (userId) => {

    //////////////////////////////////////////////////////
    // FIND EVERY CONTACT OF THIS USER
    //////////////////////////////////////////////////////

    const result = await pool.query(

        `
        SELECT

            c.contact_user_id,

            u.full_name,

            u.username,

            u.phone,

            u.profile_image

        FROM contacts c

        JOIN users u

        ON u.id = c.contact_user_id

        WHERE c.user_id = $1
        `,

        [

            userId,

        ],

    );

    return result.rows;

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
        AND
            contact_user_id = $2
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

        ON

            a.contact_user_id = b.user_id

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