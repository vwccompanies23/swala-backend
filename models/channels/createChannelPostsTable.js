const pool = require('../../config/db');

const createChannelPostsTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS channel_posts (
        id SERIAL PRIMARY KEY,
        channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT,
        media_url TEXT,
        media_type VARCHAR(30),
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        shares_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Channel Posts table ready');

  } catch (error) {

    console.error(error);

  }

};

module.exports = createChannelPostsTable;