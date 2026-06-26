const pool = require('../../config/db');

const createLikesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS likes (
      id SERIAL PRIMARY KEY,

      post_id INTEGER NOT NULL,

      user_id INTEGER NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Likes table ready'
    );

  } catch (error) {

    console.error(error);
  }
};

module.exports =
createLikesTable;