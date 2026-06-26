const pool = require('../../config/db');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      password
    } = req.body;

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Phone number already registered'
      });
    }

   const hashedPassword = await bcrypt.hash(password, 10);

   const result = await pool.query(
     `
     INSERT INTO users
     (full_name, phone, password)
     VALUES ($1, $2, $3)
     RETURNING *
     `,
     [
       full_name,
       phone,
       hashedPassword
     ]
   );

    res.status(201).json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = registerUser;