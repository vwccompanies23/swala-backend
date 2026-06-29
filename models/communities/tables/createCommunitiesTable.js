const pool = require('../../../config/db');

const createCommunitiesTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS communities (

        id SERIAL PRIMARY KEY,

        owner_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        name VARCHAR(150) NOT NULL,

        username VARCHAR(100)
        UNIQUE NOT NULL,

        description TEXT,

        profile_image TEXT,

        cover_image TEXT,

        category VARCHAR(100)
        DEFAULT 'General',

        is_private BOOLEAN
        DEFAULT FALSE,

        members_count INTEGER
        DEFAULT 0,

        posts_count INTEGER
        DEFAULT 0,

        rules_count INTEGER
        DEFAULT 0,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

      );
    `);

    console.log(
      'Communities table ready.'
    );

  } catch (error) {

    console.error(
      'Create Communities Table Error:',
      error
    );

  }

};

module.exports = createCommunitiesTable;