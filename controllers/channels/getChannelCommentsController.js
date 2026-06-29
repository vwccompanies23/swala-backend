const pool = require('../../config/db');

const getChannelComments = async (req, res) => {
  try {

    const { post_id } = req.params;

    if (!post_id) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required.',
      });
    }

    const commentsResult = await pool.query(
      `
      SELECT
        c.*,
        u.id AS user_id,
        u.full_name,
        u.profile_picture
      FROM channel_post_comments c
      JOIN users u
        ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC;
      `,
      [post_id]
    );

    res.status(200).json({
      success: true,
      count: commentsResult.rowCount,
      comments: commentsResult.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments.',
      error: error.message,
    });

  }
};

module.exports = getChannelComments;