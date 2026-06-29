const pool = require('../../config/db');

const getBusinessProfile = async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        full_name,
        username,
        profile_image,
        cover_image,
        bio,
        business_name,
        business_description,
        business_category,
        business_phone,
        business_email,
        business_website,
        business_address,
        business_logo,
        business_cover,
        followers_count,
        posts_count,
        is_verified,
        created_at
      FROM users
      WHERE id = $1
      AND is_business = TRUE;
      `,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.',
      });
    }

    res.status(200).json({
      success: true,
      business: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = getBusinessProfile;