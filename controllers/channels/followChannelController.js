const pool = require('../../config/db');

const followChannel = async (req, res) => {

  try {

    const { channel_id, user_id } = req.body;

    await pool.query(
      `
      INSERT INTO channel_followers
      (
        channel_id,
        user_id
      )
      VALUES
      (
        $1,
        $2
      )
      ON CONFLICT (channel_id, user_id)
      DO NOTHING;
      `,
      [
        channel_id,
        user_id
      ]
    );

    await pool.query(
      `
      UPDATE channels
      SET followers_count = (
        SELECT COUNT(*)
        FROM channel_followers
        WHERE channel_id = $1
      )
      WHERE id = $1;
      `,
      [channel_id]
    );

    res.status(200).json({
      success: true,
      message: "Channel followed successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

module.exports = followChannel;