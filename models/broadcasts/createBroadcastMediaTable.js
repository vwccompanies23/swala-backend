const pool = require('../../config/db');

async function createBroadcastMediaTable() {

  const query = `

    CREATE TABLE IF NOT EXISTS broadcast_media (

      id SERIAL PRIMARY KEY,

      message_id INTEGER NOT NULL
        REFERENCES broadcast_messages(id)
        ON DELETE CASCADE,

      broadcast_id INTEGER NOT NULL
        REFERENCES broadcasts(id)
        ON DELETE CASCADE,

      sender_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      media_type VARCHAR(30)
        NOT NULL,

      media_url TEXT NOT NULL,

      thumbnail_url TEXT DEFAULT '',

      width INTEGER DEFAULT 0,

      height INTEGER DEFAULT 0,

      duration INTEGER DEFAULT 0,

      size BIGINT DEFAULT 0,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );

  `;

  try {

    await pool.query(query);

    console.log(
      '✅ broadcast_media table ready.'
    );

  } catch (error) {

    console.error(
      'Create broadcast_media table error:',
      error,
    );

  }

}

module.exports =
createBroadcastMediaTable;