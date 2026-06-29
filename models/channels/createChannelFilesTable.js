const pool = require('../../config/db');

const createChannelFilesTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS channel_files (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES channel_posts(id) ON DELETE CASCADE,
        uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        file_name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(50),
        file_size BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Channel Files table ready');

  } catch (error) {

    console.error(error);

  }

};

module.exports = createChannelFilesTable;