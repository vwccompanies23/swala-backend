const pool = require('../../../config/db');

const createBusinessesTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS businesses (

        id SERIAL PRIMARY KEY,

        owner_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        business_name VARCHAR(200) NOT NULL,

        username VARCHAR(100)
        UNIQUE NOT NULL,

        description TEXT,

        logo TEXT,

        cover_image TEXT,

        phone VARCHAR(30),

        email VARCHAR(150),

        website TEXT,

        address TEXT,

        city VARCHAR(100),

        country VARCHAR(100),

        category VARCHAR(100)
        DEFAULT 'General',

        is_verified BOOLEAN
        DEFAULT FALSE,

        is_active BOOLEAN
        DEFAULT TRUE,

        followers_count INTEGER
        DEFAULT 0,

        posts_count INTEGER
        DEFAULT 0,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

      );
    `);

    console.log(
      'Businesses table ready.'
    );

  } catch (error) {

    console.error(
      'Create Businesses Table Error:',
      error
    );

  }

};

module.exports = createBusinessesTable;