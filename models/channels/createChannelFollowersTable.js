const pool = require('../../config/db');

const createChannelFollowersTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS channel_followers (
        id SERIAL PRIMARY KEY,
        channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(channel_id, user_id)
      );
    `);

    console.log('Channel Followers table ready');

  } catch (error) {

    console.error(error);

  }

};

module.exports = createChannelFollowersTable;