const pool = require('../../config/db');

async function createBroadcastReadsTable() {

  const query = `

    CREATE TABLE IF NOT EXISTS broadcast_reads (

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

      delivered BOOLEAN
        DEFAULT FALSE,

      delivered_at TIMESTAMP,

      read BOOLEAN
        DEFAULT FALSE,

      read_at TIMESTAMP,

      created_at TIMESTAMP
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
      '✅ broadcast_reads table ready.'
    );

  } catch (error) {

    console.error(
      'Create broadcast_reads table error:',
      error,
    );

  }

}

module.exports =
createBroadcastReadsTable;