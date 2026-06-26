const pool = require('../../config/db');

const getAllUsers = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        id,
        full_name,
        username,
        phone,
        bio,
        profile_image
      FROM users
      ORDER BY full_name ASC
    `);

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