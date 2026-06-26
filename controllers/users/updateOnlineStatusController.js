const pool = require('../../config/db');

const updateOnlineStatus = async (req, res) => {

  try {

    const {
      userId,
      isOnline,
    } = req.body;

    if (isOnline) {

      await pool.query(
        `
        UPDATE users
        SET
        is_online = true,
        online_since = NOW()
        WHERE id = $1
        `,
        [userId]
      );

    } else {

      await pool.query(
        `
        UPDATE users
        SET
        is_online = false,
        last_seen = NOW()
        WHERE id = $1
        `,
        [userId]
      );
    }

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = updateOnlineStatus;