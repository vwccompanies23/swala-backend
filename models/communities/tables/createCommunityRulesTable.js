const pool = require('../../../config/db');

const createCommunityRulesTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS community_rules (

        id SERIAL PRIMARY KEY,

        community_id INTEGER NOT NULL
        REFERENCES communities(id)
        ON DELETE CASCADE,

        title VARCHAR(255) NOT NULL,

        description TEXT,

        position INTEGER
        DEFAULT 1,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

      );
    `);

    console.log(
      'Community Rules table ready.'
    );

  } catch (error) {

    console.error(
      'Create Community Rules Table Error:',
      error
    );

  }

};

module.exports = createCommunityRulesTable;