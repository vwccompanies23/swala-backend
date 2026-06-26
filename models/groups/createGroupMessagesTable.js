const pool = require('../../config/db');

const createGroupMessagesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS group_messages (
      id SERIAL PRIMARY KEY,

      group_id INTEGER NOT NULL,

      sender_id INTEGER NOT NULL,

      message TEXT,

      image_url TEXT,

      video_url TEXT,

      audio_url TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Group Messages table ready'
    );

  } catch (error) {

    console.error(error);
  }
};

module.exports =
createGroupMessagesTable;