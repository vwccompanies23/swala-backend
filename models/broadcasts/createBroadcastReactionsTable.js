const pool = require('../../config/db');

async function createBroadcastReactionsTable() {

  const query = `

    CREATE TABLE IF NOT EXISTS broadcast_reactions (

      id SERIAL PRIMARY KEY,

      message_id INTEGER NOT NULL
        REFERENCES broadcast_messages(id)
        ON DELETE CASCADE,

      broadcast_id INTEGER NOT NULL
        REFERENCES broadcasts(id)
        ON DELETE CASCADE,

      user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      reaction VARCHAR(20) NOT NULL,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      UNIQUE (
        message_id,
        user_id
      )

    );

  `;

  try {

    await pool.query(query);

    console.log(
      '✅ broadcast_reactions table ready.'
    );

  } catch (error) {

    console.error(
      'Create broadcast_reactions table error:',
      error,
    );

  }

}

module.exports =
createBroadcastReactionsTable;