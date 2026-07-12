const pool = require("../../config/db");

//////////////////////////////////////////////////////
// CREATE COMMENT
//////////////////////////////////////////////////////

const createComment = async ({

    postId,

    userId,

    parentCommentId = null,

    comment,

}) => {

    const result = await pool.query(

        `
        INSERT INTO comments
        (
            post_id,
            user_id,
            parent_comment_id,
            comment
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING *
        `,

        [

            postId,

            userId,

            parentCommentId,

            comment,

        ],

    );

    return result.rows[0];

};

//////////////////////////////////////////////////////
// GET COMMENT
//////////////////////////////////////////////////////

const getComment = async (

    commentId,

) => {

    const result = await pool.query(

        `
        SELECT *
        FROM comments
        WHERE id = $1
        LIMIT 1
        `,

        [

            commentId,

        ],

    );

    return result.rows[0] || null;

};

//////////////////////////////////////////////////////
// GET POST COMMENTS
//////////////////////////////////////////////////////

const getPostComments = async (

    postId,

) => {

    const result = await pool.query(

        `
        SELECT

            c.*,

            u.full_name,

            u.username,

            u.profile_image

        FROM comments c

        JOIN users u

        ON c.user_id = u.id

        WHERE

            c.post_id = $1

        AND

            c.is_deleted = FALSE

        ORDER BY

            c.created_at ASC
        `,

        [

            postId,

        ],

    );

    return result.rows;

};

//////////////////////////////////////////////////////
// UPDATE COMMENT
//////////////////////////////////////////////////////

const updateComment = async (

    commentId,

    comment,

) => {

    const result = await pool.query(

        `
        UPDATE comments

        SET

            comment = $2,

            edited = TRUE,

            updated_at = NOW()

        WHERE

            id = $1

        RETURNING *
        `,

        [

            commentId,

            comment,

        ],

    );

    return result.rows[0];

};

//////////////////////////////////////////////////////
// DELETE COMMENT
//////////////////////////////////////////////////////

const deleteComment = async (

    commentId,

) => {

    await pool.query(

        `
        UPDATE comments

        SET

            is_deleted = TRUE,

            comment = '[Deleted]',

            updated_at = NOW()

        WHERE id = $1
        `,

        [

            commentId,

        ],

    );

};

//////////////////////////////////////////////////////
// COUNT COMMENTS
//////////////////////////////////////////////////////

const countComments = async (

    postId,

) => {

    const result = await pool.query(

        `
        SELECT COUNT(*) AS total

        FROM comments

        WHERE

            post_id = $1

        AND

            is_deleted = FALSE
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
// COUNT REPLIES
//////////////////////////////////////////////////////

const countReplies = async (

    commentId,

) => {

    const result = await pool.query(

        `
        SELECT COUNT(*) AS total

        FROM comments

        WHERE

            parent_comment_id = $1

        AND

            is_deleted = FALSE
        `,

        [

            commentId,

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

    createComment,

    getComment,

    getPostComments,

    updateComment,

    deleteComment,

    countComments,

    countReplies,

};