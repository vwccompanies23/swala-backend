const pool = require('../../../config/db');

const createCommunityJoinRequestsTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS community_join_requests (

        id SERIAL PRIMARY KEY,

        community_id INTEGER NOT NULL
        REFERENCES communities(id)
        ON DELETE CASCADE,

        user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        status VARCHAR(30)
        DEFAULT 'Pending',

        message TEXT,

        reviewed_by INTEGER
        REFERENCES users(id)
        ON DELETE SET NULL,

        reviewed_at TIMESTAMP,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        UNIQUE (community_id, user_id)

      );
    `);

    console.log(
      'Community Join Requests table ready.'
    );

  } catch (error) {

    console.error(
      'Create Community Join Requests Table Error:',
      error
    );

  }

};

module.exports = createCommunityJoinRequestsTable;