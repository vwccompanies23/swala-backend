const pool = require('../../config/db');

async function createCallsTable() {

  const query = `
    CREATE TABLE IF NOT EXISTS calls (

      id SERIAL PRIMARY KEY,

      caller_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      receiver_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      call_type VARCHAR(20)
        NOT NULL CHECK (
          call_type IN ('voice', 'video')
        ),

      status VARCHAR(20)
        NOT NULL DEFAULT 'ringing'
        CHECK (
          status IN (
            'ringing',
            'accepted',
            'rejected',
            'missed',
            'cancelled',
            'ended'
          )
        ),

      started_at TIMESTAMP,

      ended_at TIMESTAMP,

      duration INTEGER
        DEFAULT 0,

      initiated_by INTEGER
        REFERENCES users(id)
        ON DELETE SET NULL,

      ended_by INTEGER
        REFERENCES users(id)
        ON DELETE SET NULL,

      recording_url TEXT,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );
  `;

  await pool.query(query);

  console.log(
    "✅ Calls table created"
  );

}

module.exports = createCallsTable;