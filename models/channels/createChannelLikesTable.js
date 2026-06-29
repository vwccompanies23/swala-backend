const pool = require('../../config/db');

const createChannelLikesTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS channel_post_likes (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES channel_posts(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id)
      );
    `);

    console.log('Channel Likes table ready');

  } catch (error) {

    console.error(error);

  }

};

module.exports = createChannelLikesTable;