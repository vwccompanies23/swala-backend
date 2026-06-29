const pool = require('../../config/db');

const getChannel = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Channel ID is required.',
      });
    }

    const channelResult = await pool.query(
      `
      SELECT *
      FROM channels
      WHERE id = $1;
      `,
      [id]
    );

    if (channelResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found.',
      });
    }

    res.status(200).json({
      success: true,
      channel: channelResult.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch channel.',
      error: error.message,
    });

  }
};

module.exports = getChannel;