const pool = require("../../config/db");

//////////////////////////////////////////////////////
// FIND LIKE
//////////////////////////////////////////////////////

const findLike = async (

    postId,
    userId,

) => {

    const result = await pool.query(

        `
        SELECT id
        FROM likes
        WHERE
            post_id = $1
        AND
            user_id = $2
        LIMIT 1
        `,

        [

            postId,

            userId,

        ],

    );

    return result.rows[0] || null;

};

//////////////////////////////////////////////////////
// CREATE LIKE
//////////////////////////////////////////////////////

const createLike = async (

    postId,
    userId,

) => {

    return await pool.query(

        `
        INSERT INTO likes
        (
            post_id,
            user_id
        )
        VALUES
        (
            $1,
            $2
        )
        ON CONFLICT
        (
            post_id,
            user_id
        )
        DO NOTHING
        `,

        [

            postId,

            userId,

        ],

    );

};

//////////////////////////////////////////////////////
// DELETE LIKE
//////////////////////////////////////////////////////

const deleteLike = async (

    postId,
    userId,

) => {

    return await pool.query(

        `
        DELETE FROM likes
        WHERE
            post_id = $1
        AND
            user_id = $2
        `,

        [

            postId,

            userId,

        ],

    );

};

//////////////////////////////////////////////////////
// COUNT POST LIKES
//////////////////////////////////////////////////////

const countLikes = async (

    postId,

) => {

    const result = await pool.query(

        `
        SELECT COUNT(*) AS total
        FROM likes
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
// GET POST LIKES
//////////////////////////////////////////////////////

const getPostLikes = async (

    postId,

) => {

    const result = await pool.query(

        `
        SELECT
            l.id,
            l.user_id,
            u.full_name,
            u.username,
            u.profile_image,
            l.created_at
        FROM likes l

        JOIN users u
        ON u.id = l.user_id

        WHERE l.post_id = $1

        ORDER BY l.created_at DESC
        `,

        [

            postId,

        ],

    );

    return result.rows;

};

//////////////////////////////////////////////////////
// EXPORTS
//////////////////////////////////////////////////////

module.exports = {

    findLike,

    createLike,

    deleteLike,

    countLikes,

    getPostLikes,

};