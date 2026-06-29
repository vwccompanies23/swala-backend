const pool = require('../../config/db');

module.exports = async (req, res) => {
  try {
    const {
      user_id,
      creator_name,
      creator_category,
      creator_bio,
      creator_cover,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.',
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        creator_name = $2,
        creator_category = $3,
        creator_bio = $4,
        creator_cover = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING
        id,
        full_name,
        username,
        profile_image,
        cover_image,
        bio,
        is_creator,
        creator_name,
        creator_category,
        creator_bio,
        creator_cover,
        followers_count,
        following_count,
        posts_count,
        is_verified,
        updated_at;
      `,
      [
        user_id,
        creator_name,
        creator_category,
        creator_bio,
        creator_cover,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Creator profile updated successfully.',
      creator: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};