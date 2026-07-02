const pool = require('../../config/db');

async function createBroadcastNotificationSettingsTable() {

  const query = `

    CREATE TABLE IF NOT EXISTS broadcast_notification_settings (

      id SERIAL PRIMARY KEY,

      broadcast_id INTEGER NOT NULL
        REFERENCES broadcasts(id)
        ON DELETE CASCADE,

      user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      notifications_enabled BOOLEAN
        DEFAULT TRUE,

      muted BOOLEAN
        DEFAULT FALSE,

      vibration BOOLEAN
        DEFAULT TRUE,

      popup BOOLEAN
        DEFAULT TRUE,

      preview BOOLEAN
        DEFAULT TRUE,

      notification_sound VARCHAR(100)
        DEFAULT 'Default',

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
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
      '✅ broadcast_notification_settings table ready.'
    );

  } catch (error) {

    console.error(
      'Create broadcast_notification_settings table error:',
      error,
    );

  }

}

module.exports =
createBroadcastNotificationSettingsTable;