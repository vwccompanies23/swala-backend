const pool = require('../../config/db');

const unfollowChannel = async (req, res) => {

  try {

    const { channel_id, user_id } = req.body;

    await pool.query(
      `
      DELETE FROM channel_followers
      WHERE channel_id = $1
      AND user_id = $2;
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
      message: "Channel unfollowed successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

module.exports = unfollowChannel;