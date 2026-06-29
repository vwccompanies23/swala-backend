const pool = require('../../../config/db');

const likeChannelPost = async (req, res) => {
  try {

    const {
      post_id,
      user_id
    } = req.body;

    if (!post_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'post_id and user_id are required.',
      });
    }

    const postExists = await pool.query(
      `
      SELECT id
      FROM channel_posts
      WHERE id = $1;
      `,
      [post_id]
    );

    if (postExists.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    await pool.query(
      `
      INSERT INTO channel_post_likes
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
      UPDATE channel_posts
      SET likes_count = (
        SELECT COUNT(*)
        FROM channel_post_likes
        WHERE post_id = $1
      )
      WHERE id = $1;
      `,
      [post_id]
    );

    res.status(200).json({
      success: true,
      message: 'Post liked successfully.',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to like post.',
      error: error.message,
    });

  }
};

module.exports = likeChannelPost;