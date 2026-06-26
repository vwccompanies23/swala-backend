const pool = require('../../config/db');

const createComment = async (req, res) => {
  try {

    const {
      post_id,
      user_id,
      comment
    } = req.body;

    if (!post_id) {
      return res.status(400).json({
        success: false,
        error: 'Post ID is required'
      });
    }

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (
      !comment ||
      comment.trim() === ''
    ) {
      return res.status(400).json({
        success: false,
        error: 'Comment cannot be empty'
      });
    }

    const result = await pool.query(
      `
      INSERT INTO comments
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
      RETURNING *
      `,
      [
        post_id,
        user_id,
        comment
      ]
    );

    res.status(201).json({
      success: true,
      comment: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = createComment;