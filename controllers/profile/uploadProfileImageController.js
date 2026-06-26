const pool =
require('../../config/db');

const uploadProfileImage =
async (req, res) => {

  try {

    const userId =
    req.body.userId;

    if (!req.file) {

      return res.status(400).json({
        success: false,
        error: 'No image uploaded',
      });
    }

    const imagePath =
    `/uploads/profiles/${req.file.filename}`;

    await pool.query(
      `
      UPDATE users
      SET profile_image = $1
      WHERE id = $2
      `,
      [
        imagePath,
        userId,
      ]
    );

    res.json({
      success: true,
      profileImage:
      imagePath,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error:
      error.message,
    });
  }
};

module.exports =
uploadProfileImage;