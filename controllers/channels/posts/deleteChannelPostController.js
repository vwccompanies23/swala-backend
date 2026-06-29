const pool = require('../../../config/db');

const deleteChannelPost = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required.',
      });
    }

    const postResult = await pool.query(
      `
      DELETE FROM channel_posts
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (postResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    await pool.query(
      `
      UPDATE channels
      SET posts_count = GREATEST(posts_count - 1, 0)
      WHERE id = $1;
      `,
      [postResult.rows[0].channel_id]
    );

    res.status(200).json({
      success: true,
      message: 'Channel post deleted successfully.',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete channel post.',
      error: error.message,
    });

  }
};

module.exports = deleteChannelPost;