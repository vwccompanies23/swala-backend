const pool = require("../../config/db");

const createPostViewsTable = async () => {

    await pool.query(`

        CREATE TABLE IF NOT EXISTS post_views (

            id SERIAL PRIMARY KEY,

            post_id INTEGER NOT NULL
                REFERENCES posts(id)
                ON DELETE CASCADE,

            viewer_id INTEGER NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,

            viewed_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(post_id, viewer_id)

        );

    `);

    console.log("✅ Post Views table ready.");

};

module.exports = createPostViewsTable;