const pool = require('../../config/db');

const getAllUsers = async (req, res) => {

  try {

    const currentUserId = req.query.user_id;

    const result = await pool.query(
      `
      SELECT
        id,
        full_name,
        username,
        phone,
        bio,
        profile_image,
        is_online
      FROM users
      WHERE id <> $1
      ORDER BY full_name ASC
      `,
      [currentUserId],
    );

    res.json({
      success: true,
      users: result.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

};

module.exports = getAllUsers;