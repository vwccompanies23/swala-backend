const pool = require('../../../config/db');

const createCommunityLikesTable = async () => {

  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS community_post_likes (

        id SERIAL PRIMARY KEY,

        post_id INTEGER NOT NULL
        REFERENCES community_posts(id)
        ON DELETE CASCADE,

        user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        UNIQUE (post_id, user_id)

      );
    `);

    console.log(
      'Community Likes table ready.'
    );

  } catch (error) {

    console.error(
      'Create Community Likes Table Error:',
      error
    );

  }

};

module.exports = createCommunityLikesTable;