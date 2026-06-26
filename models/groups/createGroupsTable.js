const pool = require('../../config/db');

const createGroupsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS groups (
      id SERIAL PRIMARY KEY,

      group_name VARCHAR(255) NOT NULL,

      group_image TEXT,

      group_bio TEXT,

      created_by INTEGER NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Groups table ready'
    );

  } catch (error) {

    console.error(error);
  }
};

module.exports =
createGroupsTable;