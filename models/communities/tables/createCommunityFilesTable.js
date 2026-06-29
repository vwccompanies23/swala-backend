const pool = require('../../../config/db');

const createCommunityFilesTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS community_files (

        id SERIAL PRIMARY KEY,

        post_id INTEGER NOT NULL
        REFERENCES community_posts(id)
        ON DELETE CASCADE,

        uploaded_by INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        file_name VARCHAR(255) NOT NULL,

        file_url TEXT NOT NULL,

        file_type VARCHAR(100) NOT NULL,

        file_size BIGINT
        DEFAULT 0,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

      );
    `);

    console.log(
      'Community Files table ready.'
    );

  } catch (error) {

    console.error(
      'Create Community Files Table Error:',
      error
    );

  }

};

module.exports = createCommunityFilesTable;