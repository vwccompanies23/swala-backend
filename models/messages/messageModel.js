const pool = require("../../config/db");

const createMessagesTable = async () => {

  const query = `

    CREATE TABLE IF NOT EXISTS messages (

      id SERIAL PRIMARY KEY,

      chat_id INTEGER NOT NULL,

      sender_id INTEGER NOT NULL,

      message TEXT DEFAULT '',

      message_type VARCHAR(20) DEFAULT 'text',

      media_url TEXT,

      thumbnail_url TEXT,

      file_name TEXT,

      file_size BIGINT,

      duration INTEGER,

      is_read BOOLEAN DEFAULT FALSE,

      reply_to INTEGER,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );

  `;

  try {

    await pool.query(query);

    console.log("✅ Messages table ready");

  } catch (error) {

    console.error(error);

  }

};

module.exports = createMessagesTable;