const pool = require('../../config/db');

const createMessagesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,

      chat_id INTEGER NOT NULL,

      sender_id INTEGER NOT NULL,

      message TEXT NOT NULL,

      is_read BOOLEAN DEFAULT false,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Messages table ready'
    );

  } catch (error) {

    console.error(error);
  }
};

module.exports =
createMessagesTable;