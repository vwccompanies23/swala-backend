const pool = require('../../config/db');

const createCommentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,

      post_id INTEGER NOT NULL,

      user_id INTEGER NOT NULL,

      comment TEXT NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Comments table ready'
    );

  } catch (error) {

    console.error(error);
  }
};

module.exports =
createCommentsTable;