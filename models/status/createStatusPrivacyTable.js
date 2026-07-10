const pool = require("../../config/db");

const createStatusPrivacyTable = async () => {

    await pool.query(`

        CREATE TABLE IF NOT EXISTS status_privacy (

            id SERIAL PRIMARY KEY,

            status_id INTEGER NOT NULL
                REFERENCES statuses(id)
                ON DELETE CASCADE,

            user_id INTEGER NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,

            permission VARCHAR(20) NOT NULL,

            created_at TIMESTAMP DEFAULT NOW(),

            UNIQUE(status_id, user_id)

        );

    `);

    console.log("✅ Status Privacy table ready.");

};

module.exports = createStatusPrivacyTable;