const pool = require("../../config/db");

const createCommentsTable = async () => {

    const query = `

    CREATE TABLE IF NOT EXISTS comments (

        id SERIAL PRIMARY KEY,

        post_id INTEGER NOT NULL
        REFERENCES posts(id)
        ON DELETE CASCADE,

        user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        parent_comment_id INTEGER
        REFERENCES comments(id)
        ON DELETE CASCADE,

        comment TEXT NOT NULL,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );

    `;

    try {

        await pool.query(query);

        await pool.query(`
            ALTER TABLE comments
            ADD COLUMN IF NOT EXISTS parent_comment_id INTEGER
            REFERENCES comments(id)
            ON DELETE CASCADE;
        `);

        console.log("✅ Comments table ready.");

    }

    catch (error) {

        console.error(error);

    }

};

module.exports = createCommentsTable;