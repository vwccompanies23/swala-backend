const pool = require('../../config/db');

module.exports = async (req, res) => {
  try {

    const { user_id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        full_name,
        username,
        email,
        phone,
        profile_image,
        cover_image,
        bio,
        country,
        language,
        is_verified,
        is_creator,
        creator_name,
        creator_category,
        creator_bio,
        creator_cover,
        followers_count,
        following_count,
        posts_count,
        created_at

      FROM users
      WHERE id = $1
      AND is_creator = TRUE;
      `,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found.'
      });
    }

    res.status(200).json({
      success: true,
      creator: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};