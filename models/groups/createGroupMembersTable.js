const pool = require('../../config/db');

const createGroupMembersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS group_members (
      id SERIAL PRIMARY KEY,

      group_id INTEGER NOT NULL,

      user_id INTEGER NOT NULL,

      is_admin BOOLEAN DEFAULT FALSE,

      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Group Members table ready'
    );

  } catch (error) {

    console.error(error);
  }
};

module.exports =
createGroupMembersTable;