const pool = require("../../config/db");

const createStatusesTable = async () => {

    await pool.query(`

        CREATE TABLE IF NOT EXISTS statuses (

            id SERIAL PRIMARY KEY,

            user_id INTEGER NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,

            media_url TEXT DEFAULT '',

            caption TEXT DEFAULT '',

            is_video BOOLEAN DEFAULT FALSE,

            is_text BOOLEAN DEFAULT FALSE,

            duration_hours INTEGER NOT NULL DEFAULT 24,

            privacy VARCHAR(30) NOT NULL DEFAULT 'contacts',

            created_at TIMESTAMP DEFAULT NOW(),

            expires_at TIMESTAMP NOT NULL,

            updated_at TIMESTAMP DEFAULT NOW()

        );

    `);

    console.log("✅ Statuses table ready.");

};

module.exports = createStatusesTable;