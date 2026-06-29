const pool = require('../../config/db');

const addBusinessCreatorColumns = async () => {

  try {

    await pool.query(`

      ALTER TABLE users

      ADD COLUMN IF NOT EXISTS cover_image TEXT,

      ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE,

      ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP,

      ADD COLUMN IF NOT EXISTS is_business BOOLEAN DEFAULT FALSE,

      ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),

      ADD COLUMN IF NOT EXISTS business_description TEXT,

      ADD COLUMN IF NOT EXISTS business_category VARCHAR(100),

      ADD COLUMN IF NOT EXISTS business_phone VARCHAR(50),

      ADD COLUMN IF NOT EXISTS business_email VARCHAR(255),

      ADD COLUMN IF NOT EXISTS business_website TEXT,

      ADD COLUMN IF NOT EXISTS business_address TEXT,

      ADD COLUMN IF NOT EXISTS business_logo TEXT,

      ADD COLUMN IF NOT EXISTS business_cover TEXT,

      ADD COLUMN IF NOT EXISTS is_creator BOOLEAN DEFAULT FALSE,

      ADD COLUMN IF NOT EXISTS creator_name VARCHAR(255),

      ADD COLUMN IF NOT EXISTS creator_category VARCHAR(100),

      ADD COLUMN IF NOT EXISTS creator_bio TEXT,

      ADD COLUMN IF NOT EXISTS creator_cover TEXT,

      ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,

      ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0,

      ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0;

    `);

    console.log(
      'Business & Creator columns added successfully.'
    );

  } catch (error) {

    console.error(
      'Migration Error:',
      error
    );

  }

};

module.exports = addBusinessCreatorColumns;