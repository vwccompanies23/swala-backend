const pool = require('../../config/db');

async function createCallHistoryTable() {

  const query = `
    CREATE TABLE IF NOT EXISTS call_history (

      id SERIAL PRIMARY KEY,

      call_id INTEGER NOT NULL
        REFERENCES calls(id)
        ON DELETE CASCADE,

      caller_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      receiver_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      call_type VARCHAR(20)
        NOT NULL
        CHECK (
          call_type IN (
            'voice',
            'video'
          )
        ),

      status VARCHAR(30)
        NOT NULL
        CHECK (
          status IN (
            'accepted',
            'rejected',
            'missed',
            'cancelled',
            'ended'
          )
        ),

      duration INTEGER
        DEFAULT 0,

      initiated_by INTEGER
        REFERENCES users(id)
        ON DELETE SET NULL,

      ended_by INTEGER
        REFERENCES users(id)
        ON DELETE SET NULL,

      started_at TIMESTAMP,

      ended_at TIMESTAMP,

      recording_url TEXT,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );
  `;

  await pool.query(query);

  console.log(
    "✅ Call History table created"
  );

}

module.exports = createCallHistoryTable;