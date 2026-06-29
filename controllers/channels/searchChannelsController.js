const pool = require('../../config/db');

const searchChannels = async (req, res) => {

  try {

    const { query } = req.query;

    const channelResult =
    await pool.query(
      `
      SELECT *
      FROM channels
      WHERE
        LOWER(name) LIKE LOWER($1)
        OR LOWER(username) LIKE LOWER($1)
        OR LOWER(category) LIKE LOWER($1)
      ORDER BY followers_count DESC, created_at DESC;
      `,
      [
        `%${query}%`
      ]
    );

    res.status(200).json({
      success: true,
      channels: channelResult.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

module.exports = searchChannels;