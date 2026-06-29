const pool = require('../../config/db');

const createChannelsTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS channels (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER NOT NULL,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        profile_image TEXT,
        cover_image TEXT,
        category VARCHAR(50),
        verified BOOLEAN DEFAULT FALSE,
        followers_count INTEGER DEFAULT 0,
        posts_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Channels table ready');

  } catch (error) {

    console.error(error);

  }

};

module.exports = createChannelsTable;