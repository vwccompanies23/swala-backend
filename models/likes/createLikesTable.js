const pool = require("../../config/db");

const createLikesTable = async () => {

    const query = `

        CREATE TABLE IF NOT EXISTS likes (

            id SERIAL PRIMARY KEY,

            post_id INTEGER NOT NULL
                REFERENCES posts(id)
                ON DELETE CASCADE,

            user_id INTEGER NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(post_id, user_id)

        );

    `;

    try {

        await pool.query(query);

        console.log("Likes table ready");

    }

    catch (error) {

        console.error(error);

    }

};

module.exports = createLikesTable;