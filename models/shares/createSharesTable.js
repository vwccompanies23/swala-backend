const pool = require("../../config/db");

const createSharesTable = async () => {

    const query = `

        CREATE TABLE IF NOT EXISTS shares (

            id SERIAL PRIMARY KEY,

            post_id INTEGER NOT NULL,

            user_id INTEGER NOT NULL,

            share_type VARCHAR(30) DEFAULT 'internal',

            destination_type VARCHAR(30),

            destination_id INTEGER,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_share_post
            FOREIGN KEY (post_id)
            REFERENCES posts(id)
            ON DELETE CASCADE,

            CONSTRAINT fk_share_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE

        );

    `;

    try {

        await pool.query(query);

        console.log(
            "Shares table ready",
        );

    }

    catch (error) {

        console.error(error);

    }

};

module.exports =
createSharesTable;