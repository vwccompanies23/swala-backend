const pool = require('../../../config/db');

const updateChannelPost = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      content,
      media_url,
      media_type
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required.',
      });
    }

    if (!content && !media_url) {
      return res.status(400).json({
        success: false,
        message: 'A post must contain text or media.',
      });
    }

    const postResult = await pool.query(
      `
      UPDATE channel_posts
      SET
        content = $1,
        media_url = $2,
        media_type = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
      `,
      [
        content,
        media_url,
        media_type,
        id
      ]
    );

    if (postResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Channel post updated successfully.',
      post: postResult.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to update channel post.',
      error: error.message,
    });

  }
};

module.exports = updateChannelPost;