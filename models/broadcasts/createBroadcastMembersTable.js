const pool = require('../../config/db');

async function createBroadcastMembersTable() {

  const query = `

    CREATE TABLE IF NOT EXISTS broadcast_members (

      id SERIAL PRIMARY KEY,

      broadcast_id INTEGER NOT NULL
        REFERENCES broadcasts(id)
        ON DELETE CASCADE,

      user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      joined_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      UNIQUE (
        broadcast_id,
        user_id
      )

    );

  `;

  try {

    await pool.query(query);

    console.log(
      '✅ broadcast_members table ready.'
    );

  } catch (error) {

    console.error(
      'Create broadcast_members table error:',
      error,
    );

  }

}

module.exports =
createBroadcastMembersTable;