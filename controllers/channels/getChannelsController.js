const pool = require('../../config/db');

const getChannels = async (req, res) => {
  try {

    const channelResult = await pool.query(
      `
      SELECT *
      FROM channels
      ORDER BY created_at DESC;
      `
    );

    res.status(200).json({
      success: true,
      count: channelResult.rowCount,
      channels: channelResult.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch channels.',
      error: error.message,
    });

  }
};

module.exports = getChannels;