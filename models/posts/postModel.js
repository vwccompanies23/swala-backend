const pool = require('../../config/db');

const createPostsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,

      user_id INTEGER NOT NULL,

      content TEXT,

      image_url TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Posts table ready'
    );

  } catch (error) {

    console.error(error);
  }
};

module.exports =
createPostsTable;