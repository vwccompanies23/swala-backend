const pool = require('../../config/db');

const getUser = async (req, res) => {
  try {

    const { id } = req.params;

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
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = getUser;