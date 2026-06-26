const pool = require('../../config/db');

const createChatsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS chats (
      id SERIAL PRIMARY KEY,

      user_one_id INTEGER NOT NULL,

      user_two_id INTEGER NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Chats table ready'
    );

  } catch (error) {

    console.error(error);
  }
};

module.exports =
createChatsTable;