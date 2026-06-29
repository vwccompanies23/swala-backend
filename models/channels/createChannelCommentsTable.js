const pool = require('../../config/db');

const createChannelCommentsTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS channel_post_comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES channel_posts(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Channel Comments table ready');

  } catch (error) {

    console.error(error);

  }

};

module.exports = createChannelCommentsTable;