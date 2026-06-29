const pool = require('../../../config/db');

const createCommunityPostsTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS community_posts (

        id SERIAL PRIMARY KEY,

        community_id INTEGER NOT NULL
        REFERENCES communities(id)
        ON DELETE CASCADE,

        author_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        content TEXT,

        media_url TEXT,

        media_type VARCHAR(50),

        is_pinned BOOLEAN
        DEFAULT FALSE,

        likes_count INTEGER
        DEFAULT 0,

        comments_count INTEGER
        DEFAULT 0,

        shares_count INTEGER
        DEFAULT 0,

        views_count INTEGER
        DEFAULT 0,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

      );
    `);

    console.log(
      'Community Posts table ready.'
    );

  } catch (error) {

    console.error(
      'Create Community Posts Table Error:',
      error
    );

  }

};

module.exports = createCommunityPostsTable;