const pool = require('../../config/db');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
  try {
    const {
      phone,
      password
    } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = result.rows[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profile_image: user.profile_image,
        bio: user.bio,
        language: user.language,
        country: user.country,
        is_verified: user.is_verified
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = loginUser;