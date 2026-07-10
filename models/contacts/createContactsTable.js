const pool = require("../../config/db");

const createContactsTable = async () => {

    await pool.query(`

        CREATE TABLE IF NOT EXISTS contacts (

            id SERIAL PRIMARY KEY,

            user_id INTEGER NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,

            contact_user_id INTEGER NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,

            contact_name VARCHAR(255),

            phone VARCHAR(50),

            is_favorite BOOLEAN DEFAULT FALSE,

            is_blocked BOOLEAN DEFAULT FALSE,

            is_muted BOOLEAN DEFAULT FALSE,

            created_at TIMESTAMP DEFAULT NOW(),

            UNIQUE(user_id, contact_user_id)

        );

    `);

    console.log("✅ Contacts table ready.");

};

module.exports = createContactsTable;