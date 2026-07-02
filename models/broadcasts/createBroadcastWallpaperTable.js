const pool = require('../../config/db');

async function createBroadcastWallpaperTable() {

  const query = `

    CREATE TABLE IF NOT EXISTS broadcast_wallpapers (

      id SERIAL PRIMARY KEY,

      broadcast_id INTEGER NOT NULL
        REFERENCES broadcasts(id)
        ON DELETE CASCADE,

      user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      wallpaper_type VARCHAR(30)
        DEFAULT 'default',

      wallpaper_path TEXT DEFAULT '',

      wallpaper_color VARCHAR(30)
        DEFAULT '',

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
      '✅ broadcast_wallpapers table ready.'
    );

  } catch (error) {

    console.error(
      'Create broadcast_wallpapers table error:',
      error,
    );

  }

}

module.exports =
createBroadcastWallpaperTable;