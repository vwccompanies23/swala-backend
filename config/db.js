const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // CRITICAL: Force SSL for remote cloud databases like Supabase, Render, Neon, etc.
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 20000, // 20 seconds timeout to prevent abrupt drops
  idleTimeoutMillis: 30000,
  max: 10, // Limit simultaneous pool connections during startup to avoid flooding
});

pool.on('error', (err, client) => {
  console.error('⚠️ Unexpected error on idle PostgreSQL client:', err);
});

pool.connect()
  .then((client) => {
    console.log('✅ Connected to Remote PostgreSQL Database securely');
    client.release();
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = pool;