const pool = require('../../../config/db');

const commentChannelPost = async (req, res) => {
  try {

    const {
      post_id,
      user_id,
      comment
    } = req.body;

    if (!post_id || !user_id || !comment) {
      return res.status(400).json({
        success: false,
        message: 'post_id, user_id and comment are required.',
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

    const commentResult = await pool.query(
      `
      INSERT INTO channel_post_comments
      (
        post_id,
        user_id,
        comment
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *;
      `,
      [
        post_id,
        user_id,
        comment
      ]
    );

    await pool.query(
      `
      UPDATE channel_posts
      SET comments_count = (
        SELECT COUNT(*)
        FROM channel_post_comments
        WHERE post_id = $1
      )
      WHERE id = $1;
      `,
      [post_id]
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      comment: commentResult.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to add comment.',
      error: error.message,
    });

  }
};

module.exports = commentChannelPost;