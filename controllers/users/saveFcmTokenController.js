const pool = require('../../config/db');

const saveFcmToken = async (req, res) => {

  const { userId, token } = req.body;

  try {

    await pool.query(
      `
      UPDATE users
      SET fcm_token = $1
      WHERE id = $2
      `,
      [token, userId]
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: 'Failed to save FCM token',
    });

  }

};

module.exports = saveFcmToken;