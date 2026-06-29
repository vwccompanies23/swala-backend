const pool = require('../../config/db');

async function createCallSignalsTable() {

  const query = `
    CREATE TABLE IF NOT EXISTS call_signals (

      id SERIAL PRIMARY KEY,

      call_id INTEGER NOT NULL
        REFERENCES calls(id)
        ON DELETE CASCADE,

      sender_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      receiver_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      signal_type VARCHAR(30)
        NOT NULL
        CHECK (
          signal_type IN (
            'offer',
            'answer',
            'ice-candidate',
            'renegotiate',
            'bye'
          )
        ),

      signal_data JSONB
        NOT NULL,

      is_processed BOOLEAN
        DEFAULT FALSE,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );
  `;

  await pool.query(query);

  console.log(
    "✅ Call Signals table created"
  );

}

module.exports = createCallSignalsTable;