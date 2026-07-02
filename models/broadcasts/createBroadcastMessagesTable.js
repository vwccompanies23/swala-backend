const pool = require('../../config/db');

async function createBroadcastMessagesTable() {

  const query = `

    CREATE TABLE IF NOT EXISTS broadcast_messages (

      id SERIAL PRIMARY KEY,

      broadcast_id INTEGER NOT NULL
        REFERENCES broadcasts(id)
        ON DELETE CASCADE,

      sender_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      message TEXT,

      message_type VARCHAR(30)
        DEFAULT 'text',

      media_url TEXT DEFAULT '',

      thumbnail_url TEXT DEFAULT '',

      file_name TEXT DEFAULT '',

      file_size BIGINT DEFAULT 0,

      mime_type VARCHAR(100) DEFAULT '',

      reply_to INTEGER
        REFERENCES broadcast_messages(id)
        ON DELETE SET NULL,

      forwarded BOOLEAN
        DEFAULT FALSE,

      edited BOOLEAN
        DEFAULT FALSE,

      deleted BOOLEAN
        DEFAULT FALSE,

      delivered BOOLEAN
        DEFAULT FALSE,

      pinned BOOLEAN
        DEFAULT FALSE,

      starred BOOLEAN
        DEFAULT FALSE,

      disappearing BOOLEAN
        DEFAULT FALSE,

      expires_at TIMESTAMP,

      latitude DOUBLE PRECISION,

      longitude DOUBLE PRECISION,

      contact_name TEXT DEFAULT '',

      contact_phone TEXT DEFAULT '',

      poll_question TEXT DEFAULT '',

      poll_options JSONB,

      event_title TEXT DEFAULT '',

      event_location TEXT DEFAULT '',

      event_time TIMESTAMP,

      mentions JSONB,

      metadata JSONB,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );

  `;

  try {

    await pool.query(query);

    console.log(
      '✅ broadcast_messages table ready.'
    );

  } catch (error) {

    console.error(
      'Create broadcast_messages table error:',
      error,
    );

  }

}

module.exports =
createBroadcastMessagesTable;