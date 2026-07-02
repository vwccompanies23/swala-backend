const pool = require('../../config/db');

async function createBroadcastFilesTable() {

  const query = `

    CREATE TABLE IF NOT EXISTS broadcast_files (

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

      file_name VARCHAR(255) NOT NULL,

      file_url TEXT NOT NULL,

      file_extension VARCHAR(20),

      mime_type VARCHAR(100),

      file_size BIGINT DEFAULT 0,

      downloaded_count INTEGER DEFAULT 0,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );

  `;

  try {

    await pool.query(query);

    console.log(
      '✅ broadcast_files table ready.'
    );

  } catch (error) {

    console.error(
      'Create broadcast_files table error:',
      error,
    );

  }

}

module.exports =
createBroadcastFilesTable;