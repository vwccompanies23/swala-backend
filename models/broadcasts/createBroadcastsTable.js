const pool = require('../../config/db');

async function createBroadcastsTable() {

  const query = `

    CREATE TABLE IF NOT EXISTS broadcasts (

      id SERIAL PRIMARY KEY,

      creator_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      name VARCHAR(120) NOT NULL,

      photo TEXT DEFAULT '',

      description TEXT DEFAULT '',

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );

  `;

  try {

    await pool.query(query);

    console.log(
      '✅ broadcasts table ready.'
    );

  } catch (error) {

    console.error(
      'Create broadcasts table error:',
      error,
    );

  }

}

module.exports =
createBroadcastsTable;