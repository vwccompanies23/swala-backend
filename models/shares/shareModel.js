const pool = require("../../config/db");

//////////////////////////////////////////////////////
// CREATE SHARE
//////////////////////////////////////////////////////

const createShare = async ({

    postId,

    userId,

    shareType = "internal",

    destinationType = null,

    destinationId = null,

}) => {

    const result = await pool.query(

        `
        INSERT INTO shares
        (
            post_id,
            user_id,
            share_type,
            destination_type,
            destination_id
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        RETURNING *
        `,

        [

            postId,

            userId,

            shareType,

            destinationType,

            destinationId,

        ],

    );

    return result.rows[0];

};

//////////////////////////////////////////////////////
// GET SHARE
//////////////////////////////////////////////////////

const getShare = async (

    shareId,

) => {

    const result = await pool.query(

        `
        SELECT *
        FROM shares
        WHERE id = $1
        LIMIT 1
        `,

        [

            shareId,

        ],

    );

    return result.rows[0] || null;

};

//////////////////////////////////////////////////////
// GET POST SHARES
//////////////////////////////////////////////////////

const getPostShares = async (

    postId,

) => {

    const result = await pool.query(

        `
        SELECT

            s.*,

            u.full_name,

            u.username,

            u.profile_image

        FROM shares s

        JOIN users u

        ON s.user_id = u.id

        WHERE s.post_id = $1

        ORDER BY s.created_at DESC
        `,

        [

            postId,

        ],

    );

    return result.rows;

};

//////////////////////////////////////////////////////
// DELETE SHARE
//////////////////////////////////////////////////////

const deleteShare = async (

    shareId,

) => {

    await pool.query(

        `
        DELETE FROM shares
        WHERE id = $1
        `,

        [

            shareId,

        ],

    );

};

//////////////////////////////////////////////////////
// COUNT SHARES
//////////////////////////////////////////////////////

const countShares = async (

    postId,

) => {

    const result = await pool.query(

        `
        SELECT COUNT(*) AS total

        FROM shares

        WHERE post_id = $1
        `,

        [

            postId,

        ],

    );

    return Number(

        result.rows[0].total,

    );

};

//////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////

module.exports = {

    createShare,

    getShare,

    getPostShares,

    deleteShare,

    countShares,

};