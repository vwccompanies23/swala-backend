const pool = require('../../../config/db');

const getChannelPosts = async (req, res) => {
  try {

    const { channel_id } = req.params;

    if (!channel_id) {
      return res.status(400).json({
        success: false,
        message: 'Channel ID is required.',
      });
    }

    const postResult = await pool.query(
      `
      SELECT *
      FROM channel_posts
      WHERE channel_id = $1
      ORDER BY created_at DESC;
      `,
      [channel_id]
    );

    res.status(200).json({
      success: true,
      count: postResult.rowCount,
      posts: postResult.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch channel posts.',
      error: error.message,
    });

  }
};

module.exports = getChannelPosts;