const pool = require('../../config/db');

const updateCommunity = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      name,
      username,
      description,
      profile_image,
      cover_image,
      category,
      is_private
    } = req.body;

    const result = await pool.query(
      `
      UPDATE communities
      SET
        name = $1,
        username = $2,
        description = $3,
        profile_image = $4,
        cover_image = $5,
        category = $6,
        is_private = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *;
      `,
      [
        name,
        username,
        description,
        profile_image,
        cover_image,
        category,
        is_private,
        id
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Community not found"

      });

    }

    res.status(200).json({

      success: true,

      community: result.rows[0]

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = updateCommunity;