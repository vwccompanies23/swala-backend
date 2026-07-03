const pool = require("../../config/db");

const updateFcmToken = async (req, res) => {

  try {

    const { userId, token } = req.body;

    console.log("========== SAVE FCM TOKEN ==========");
    console.log("User:", userId);
    console.log("Token:", token);

    await pool.query(
      `
      UPDATE users
      SET fcm_token = $2
      WHERE id = $1
      `,
      [
        userId,
        token,
      ],
    );

    console.log("✅ FCM token saved.");

    res.json({
      success: true,
    });

  } catch (e) {

    console.error("❌ FCM TOKEN ERROR");
    console.error(e);

    res.status(500).json({
      success: false,
      error: e.message,
    });

  }

};

module.exports = updateFcmToken;