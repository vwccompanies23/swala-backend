const pool = require("../../config/db");

const createPostsTable = async () => {

    const query = `

    CREATE TABLE IF NOT EXISTS posts (

        //////////////////////////////////////////////////////
        // PRIMARY KEY
        //////////////////////////////////////////////////////

        id SERIAL PRIMARY KEY,

        //////////////////////////////////////////////////////
        // OWNER
        //////////////////////////////////////////////////////

        user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        //////////////////////////////////////////////////////
        // CONTENT
        //////////////////////////////////////////////////////

        content TEXT DEFAULT '',

        media_url TEXT DEFAULT '',

        cloudinary_public_id TEXT,

        is_video BOOLEAN DEFAULT FALSE,

        //////////////////////////////////////////////////////
        // PRIVACY
        //////////////////////////////////////////////////////

        privacy VARCHAR(30)
        DEFAULT 'contacts',

        //////////////////////////////////////////////////////
        // LIFETIME
        //////////////////////////////////////////////////////

        lifetime VARCHAR(30)
        DEFAULT 'forever',

        expires_at TIMESTAMP,

        //////////////////////////////////////////////////////
        // DATES
        //////////////////////////////////////////////////////

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

    );

    `;

    try {

        //////////////////////////////////////////////////////
        // CREATE TABLE
        //////////////////////////////////////////////////////

        await pool.query(query);

        //////////////////////////////////////////////////////
        // ADD MISSING COLUMNS
        //////////////////////////////////////////////////////

        await pool.query(`
            ALTER TABLE posts
            ADD COLUMN IF NOT EXISTS user_id INTEGER
            REFERENCES users(id)
            ON DELETE CASCADE;
        `);

        await pool.query(`
            ALTER TABLE posts
            ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
        `);

        await pool.query(`
            ALTER TABLE posts
            ADD COLUMN IF NOT EXISTS media_url TEXT DEFAULT '';
        `);

        await pool.query(`
            ALTER TABLE posts
            ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT;
        `);

        await pool.query(`
            ALTER TABLE posts
            ADD COLUMN IF NOT EXISTS is_video BOOLEAN DEFAULT FALSE;
        `);

        await pool.query(`
            ALTER TABLE posts
            ADD COLUMN IF NOT EXISTS privacy VARCHAR(30)
            DEFAULT 'contacts';
        `);

        await pool.query(`
            ALTER TABLE posts
            ADD COLUMN IF NOT EXISTS lifetime VARCHAR(30)
            DEFAULT 'forever';
        `);

        await pool.query(`
            ALTER TABLE posts
            ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP;
        `);

        //////////////////////////////////////////////////////
        // REMOVE OLD COLUMN
        //////////////////////////////////////////////////////

        await pool.query(`
            ALTER TABLE posts
            DROP COLUMN IF EXISTS duration_hours;
        `);

        console.log("✅ Posts table ready.");

    }

    catch (error) {

        console.error("❌ Posts table error:");

        console.error(error);

    }

};

module.exports = createPostsTable;