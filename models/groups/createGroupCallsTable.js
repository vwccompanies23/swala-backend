const pool = require('../../config/db');

const createGroupCallsTable = async () => {

  const query = `
    CREATE TABLE IF NOT EXISTS group_calls (

      id SERIAL PRIMARY KEY,

      group_id INTEGER NOT NULL,

      started_by INTEGER NOT NULL,

      call_type VARCHAR(20) NOT NULL,

      is_active BOOLEAN DEFAULT TRUE,

      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      ended_at TIMESTAMP
    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Group Calls table ready'
    );

  } catch (error) {

    console.error(error);
  }
};

module.exports =
createGroupCallsTable;