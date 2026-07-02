const pool = require('../../config/db');

async function createBroadcastLinksTable() {

  const query = `

    CREATE TABLE IF NOT EXISTS broadcast_links (

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

      url TEXT NOT NULL,

      title TEXT DEFAULT '',

      description TEXT DEFAULT '',

      image TEXT DEFAULT '',

      domain VARCHAR(255) DEFAULT '',

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );

  `;

  try {

    await pool.query(query);

    console.log(
      '✅ broadcast_links table ready.'
    );

  } catch (error) {

    console.error(
      'Create broadcast_links table error:',
      error,
    );

  }

}

module.exports =
createBroadcastLinksTable;