const pool = require('../../config/db');

const searchUsers = async (req, res) => {
  try {

    const search = req.query.q || '';

    const result = await pool.query(
      `
      SELECT
        id,
        full_name,
        username,
        phone,
        bio,
        profile_image
      FROM users
      WHERE
        full_name ILIKE $1
        OR username ILIKE $1
        OR phone ILIKE $1
      `,
      [`%${search}%`]
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

module.exports = searchUsers;