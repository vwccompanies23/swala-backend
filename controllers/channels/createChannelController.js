const pool = require('../../config/db');

const createChannel = async (req, res) => {
  try {

    const {
      owner_id,
      name,
      username,
      description,
      profile_image,
      cover_image,
      category
    } = req.body;

    if (!owner_id || !name || !username) {
      return res.status(400).json({
        success: false,
        message: 'owner_id, name and username are required.'
      });
    }

    const channelResult = await pool.query(
      `
      INSERT INTO channels
      (
        owner_id,
        name,
        username,
        description,
        profile_image,
        cover_image,
        category
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING *;
      `,
      [
        owner_id,
        name,
        username,
        description,
        profile_image,
        cover_image,
        category
      ]
    );

    res.status(201).json({
      success: true,
      channel: channelResult.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to create channel.',
      error: error.message
    });

  }
};

module.exports = createChannel;