const pool = require('../../../config/db');

const createCommunityCommentsTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS community_post_comments (

        id SERIAL PRIMARY KEY,

        post_id INTEGER NOT NULL
        REFERENCES community_posts(id)
        ON DELETE CASCADE,

        user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        parent_comment_id INTEGER
        REFERENCES community_post_comments(id)
        ON DELETE CASCADE,

        comment TEXT NOT NULL,

        likes_count INTEGER
        DEFAULT 0,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

      );
    `);

    console.log(
      'Community Comments table ready.'
    );

  } catch (error) {

    console.error(
      'Create Community Comments Table Error:',
      error
    );

  }

};

module.exports = createCommunityCommentsTable;