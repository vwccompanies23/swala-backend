const pool = require('../../config/db');

const getAvailableUsers = async (req, res) => {

  try {

    const { userId } = req.params;

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
      WHERE id != $1
      ORDER BY full_name ASC
      `,

      [userId]

    );

    return res.status(200).json({

      success: true,

      users: result.rows,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports = getAvailableUsers;