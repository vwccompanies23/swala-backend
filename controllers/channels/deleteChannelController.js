const pool = require('../../config/db');

const deleteChannel = async (req, res) => {

  try {

    const { id } = req.params;

    const channelResult =
    await pool.query(
      `
      DELETE FROM channels
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (channelResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Channel deleted successfully",
      channel: channelResult.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

module.exports = deleteChannel;