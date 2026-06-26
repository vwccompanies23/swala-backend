const pool = require('../../config/db');

const createGroupFilesTable = async () => {

  const query = `
    CREATE TABLE IF NOT EXISTS group_files (

      id SERIAL PRIMARY KEY,

      group_id INTEGER NOT NULL,

      sender_id INTEGER NOT NULL,

      file_name TEXT,

      file_url TEXT,

      file_type VARCHAR(50),

      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Group Files table ready'
    );

  } catch (error) {

    console.error(error);
  }
};

module.exports =
createGroupFilesTable;