const pool = require('../../config/db');

const updateChannel = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      name,
      username,
      description,
      profile_image,
      cover_image,
      category
    } = req.body;

    const channelResult =
    await pool.query(
      `
      UPDATE channels
      SET
        name = $1,
        username = $2,
        description = $3,
        profile_image = $4,
        cover_image = $5,
        category = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *;
      `,
      [
        name,
        username,
        description,
        profile_image,
        cover_image,
        category,
        id
      ]
    );

    if (channelResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    res.status(200).json({
      success: true,
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

module.exports = updateChannel;