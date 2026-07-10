const pool = require("../../config/db");

const createStatusViewsTable = async () => {

    await pool.query(`

        CREATE TABLE IF NOT EXISTS status_views (

            id SERIAL PRIMARY KEY,

            status_id INTEGER NOT NULL
                REFERENCES statuses(id)
                ON DELETE CASCADE,

            viewer_id INTEGER NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,

            viewed_at TIMESTAMP DEFAULT NOW(),

            UNIQUE(status_id, viewer_id)

        );

    `);

    console.log("✅ Status Views table ready.");

};

module.exports = createStatusViewsTable;