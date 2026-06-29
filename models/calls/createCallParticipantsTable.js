const pool = require('../../config/db');

async function createCallParticipantsTable() {

  const query = `
    CREATE TABLE IF NOT EXISTS call_participants (

      id SERIAL PRIMARY KEY,

      call_id INTEGER NOT NULL
        REFERENCES calls(id)
        ON DELETE CASCADE,

      user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      role VARCHAR(20)
        NOT NULL
        DEFAULT 'participant'
        CHECK (
          role IN (
            'host',
            'participant',
            'moderator'
          )
        ),

      joined_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      left_at TIMESTAMP,

      is_muted BOOLEAN
        DEFAULT FALSE,

      is_camera_on BOOLEAN
        DEFAULT TRUE,

      is_screen_sharing BOOLEAN
        DEFAULT FALSE,

      connection_state VARCHAR(20)
        DEFAULT 'connecting'
        CHECK (
          connection_state IN (
            'connecting',
            'connected',
            'disconnected'
          )
        ),

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );
  `;

  await pool.query(query);

  console.log(
    "✅ Call Participants table created"
  );

}

module.exports = createCallParticipantsTable;