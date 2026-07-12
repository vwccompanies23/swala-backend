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
            ON DELETE CASCADE,

            CONSTRAINT unique_post_share
            UNIQUE
            (
                post_id,
                user_id,
                share_type,
                destination_type,
                destination_id
            )

        );

        CREATE INDEX IF NOT EXISTS idx_shares_post
        ON shares(post_id);

        CREATE INDEX IF NOT EXISTS idx_shares_user
        ON shares(user_id);

    `;

    try {

        await pool.query(query);

        console.log("✅ Shares table ready");

    }

    catch (error) {

        console.error(error);

    }

};

module.exports = createSharesTable;