const pool = require('../../config/db');

const updateBusinessProfile = async (req, res) => {
  try {
    const {
      user_id,
      business_name,
      business_description,
      business_category,
      business_phone,
      business_email,
      business_website,
      business_address,
      business_logo,
      business_cover,
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
        business_name = $2,
        business_description = $3,
        business_category = $4,
        business_phone = $5,
        business_email = $6,
        business_website = $7,
        business_address = $8,
        business_logo = $9,
        business_cover = $10
      WHERE id = $1
      RETURNING *;
      `,
      [
        user_id,
        business_name,
        business_description,
        business_category,
        business_phone,
        business_email,
        business_website,
        business_address,
        business_logo,
        business_cover,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Business profile updated successfully.',
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = updateBusinessProfile;