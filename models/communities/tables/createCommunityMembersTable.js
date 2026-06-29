const pool = require('../../../config/db');

const createCommunityMembersTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS community_members (

        id SERIAL PRIMARY KEY,

        community_id INTEGER NOT NULL
        REFERENCES communities(id)
        ON DELETE CASCADE,

        user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        role VARCHAR(50)
        DEFAULT 'Member',

        status VARCHAR(50)
        DEFAULT 'Active',

        joined_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        UNIQUE (community_id, user_id)

      );
    `);

    console.log(
      'Community Members table ready.'
    );

  } catch (error) {

    console.error(
      'Create Community Members Table Error:',
      error
    );

  }

};

module.exports = createCommunityMembersTable;