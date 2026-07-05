const db = require("../../config/db");

async function createMediaMessagesTable() {

    await db.query(`

        CREATE TABLE IF NOT EXISTS media_messages (

            id SERIAL PRIMARY KEY,

            message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,

            chat_id INTEGER NOT NULL,

            sender_id INTEGER NOT NULL,

            media_type VARCHAR(30) NOT NULL,

            file_name TEXT,

            original_name TEXT,

            file_path TEXT NOT NULL,

            file_url TEXT NOT NULL,

            mime_type TEXT,

            file_size BIGINT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );

    `);

    console.log("✅ media_messages table ready.");

}

module.exports = createMediaMessagesTable;