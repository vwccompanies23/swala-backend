const pool = require('../../config/db');

const uploadProfileImage = async (req, res) => {

  try {

    const userId = req.body.userId;

    if (!req.file) {

      return res.status(400).json({
        success: false,
        error: 'No image uploaded',
      });
    }

    const imagePath =
      `/uploads/profiles/${req.file.filename}`;

    const result = await pool.query(
      `
      UPDATE users
      SET profile_image = $1
      WHERE id = $2
      RETURNING *
      `,
      [
        imagePath,
        userId,
      ]
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
      profileImage: imagePath,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = uploadProfileImage;