const pool = require('../../../config/db');

const createCommunityInvitationsTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS community_invitations (

        id SERIAL PRIMARY KEY,

        community_id INTEGER NOT NULL
        REFERENCES communities(id)
        ON DELETE CASCADE,

        invited_by INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        invited_user INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        status VARCHAR(30)
        DEFAULT 'Pending',

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        UNIQUE (community_id, invited_user)

      );
    `);

    console.log(
      'Community Invitations table ready.'
    );

  } catch (error) {

    console.error(
      'Create Community Invitations Table Error:',
      error
    );

  }

};

module.exports = createCommunityInvitationsTable;