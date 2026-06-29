const pool = require('../../../config/db');

const getChannelFiles = async (req, res) => {
  try {

    const { post_id } = req.params;

    if (!post_id) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required.',
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM channel_files
      WHERE post_id = $1
      ORDER BY created_at ASC;
      `,
      [post_id]
    );

    res.status(200).json({
      success: true,
      count: result.rowCount,
      files: result.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch channel files.',
      error: error.message,
    });

  }
};

module.exports = getChannelFiles;