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
     bio TEXT,
     language VARCHAR(50) DEFAULT 'English',
     country VARCHAR(100),
     fcm_token TEXT,
     is_verified BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
  `;

  try {
    await pool.query(query);
    console.log('Users table ready');
  } catch (error) {
    console.error(error);
  }
};

module.exports = createUsersTable;