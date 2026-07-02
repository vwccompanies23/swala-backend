const pool = require('../../config/db');

const { getIO } =
require('../../socket/socketServer');

const { getSockets } =
require('../../socket/userRegistry');

const updateProfile = async (req, res) => {

  try {

    const {

      userId,

      full_name,

      username,

      bio,

    } = req.body;

    if (!userId) {

      return res.status(400).json({

        success: false,

        error: "User ID is required",

      });

    }

    const result = await pool.query(

      `
      UPDATE users
      SET
        full_name = $1,
        username = $2,
        bio = $3
      WHERE id = $4
      RETURNING
        id,
        full_name,
        username,
        phone,
        bio,
        profile_image
      `,

      [

        full_name,

        username,

        bio,

        userId,

      ],

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        error: "User not found",

      });

    }

    const updatedUser =
        result.rows[0];

    // Notify all connected devices
    const sockets =
        getSockets(updatedUser.id);

    sockets.forEach((socketId) => {

      getIO()

          .to(socketId)

          .emit(

            "profile-updated",

            updatedUser,

          );

    });

    return res.json({

      success: true,

      user: updatedUser,

    });

  } catch (error) {

    console.error(
      "Update Profile Error:",
      error,
    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports = updateProfile;