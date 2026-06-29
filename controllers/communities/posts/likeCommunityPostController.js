const pool = require('../../../config/db');

const likeCommunityPost = async (req, res) => {

  try {

    const {
      post_id,
      user_id
    } = req.body;

    await pool.query(
      `
      INSERT INTO community_post_likes
      (
        post_id,
        user_id
      )
      VALUES
      (
        $1,
        $2
      )
      ON CONFLICT (post_id, user_id)
      DO NOTHING;
      `,
      [
        post_id,
        user_id
      ]
    );

    await pool.query(
      `
      UPDATE community_posts
      SET likes_count = (
        SELECT COUNT(*)
        FROM community_post_likes
        WHERE post_id = $1
      )
      WHERE id = $1;
      `,
      [post_id]
    );

    res.status(200).json({
      success: true,
      message: 'Post liked successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

module.exports = likeCommunityPost;