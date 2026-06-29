const pool = require('../../config/db');

const createUsersTable = async () => {

  const query = `
    CREATE TABLE IF NOT EXISTS users (

      id SERIAL PRIMARY KEY,

      full_name VARCHAR(255) NOT NULL,

      username VARCHAR(100) UNIQUE,

      email VARCHAR(255) UNIQUE,

      phone VARCHAR(50) UNIQUE,

      password VARCHAR(255) NOT NULL,

      profile_image TEXT,

      cover_image TEXT,

      bio TEXT,

      language VARCHAR(50)
      DEFAULT 'English',

      country VARCHAR(100),

      fcm_token TEXT,

      is_verified BOOLEAN
      DEFAULT FALSE,

      is_online BOOLEAN
      DEFAULT FALSE,

      last_seen TIMESTAMP,

      /* ==========================
         BUSINESS MODE
      ========================== */

      is_business BOOLEAN
      DEFAULT FALSE,

      business_name VARCHAR(255),

      business_description TEXT,

      business_category VARCHAR(100),

      business_phone VARCHAR(50),

      business_email VARCHAR(255),

      business_website TEXT,

      business_address TEXT,

      business_logo TEXT,

      business_cover TEXT,

      /* ==========================
         CREATOR MODE
      ========================== */

      is_creator BOOLEAN
      DEFAULT FALSE,

      creator_name VARCHAR(255),

      creator_category VARCHAR(100),

      creator_bio TEXT,

      creator_cover TEXT,

      /* ==========================
         STATISTICS
      ========================== */

      followers_count INTEGER
      DEFAULT 0,

      following_count INTEGER
      DEFAULT 0,

      posts_count INTEGER
      DEFAULT 0,

      created_at TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP

    );
  `;

  try {

    await pool.query(query);

    console.log(
      'Users table ready'
    );

  } catch (error) {

    console.error(error);

  }

};

module.exports = createUsersTable;