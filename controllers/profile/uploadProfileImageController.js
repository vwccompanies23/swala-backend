const pool = require('../../config/db');

const uploadProfileImage = async (req, res) => {

  try {

    const { userId } = req.body;

    if (!userId) {

      return res.status(400).json({

        success: false,

        error: 'User ID is required',

      });

    }

    if (!req.file) {

      return res.status(400).json({

        success: false,

        error: 'No image uploaded',

      });

    }

   const imagePath = req.file.path;

    const result = await pool.query(

      `
      UPDATE users
      SET profile_image = $1
      WHERE id = $2
      RETURNING
        id,
        full_name,
        username,
        phone,
        bio,
        profile_image
      `,

      [
        imagePath,
        userId,
      ],

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        error: 'User not found',

      });

    }

    return res.json({

      success: true,

      message: 'Profile image updated successfully.',

      user: result.rows[0],

    });

  } catch (error) {

    console.error('Upload Profile Image Error');
    console.error(error);

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports = uploadProfileImage;