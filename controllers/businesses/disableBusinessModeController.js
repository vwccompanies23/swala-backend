const pool = require('../../config/db');

const disableBusinessMode = async (req, res) => {
  try {
    const { user_id } = req.body;

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
        is_business = FALSE,
        business_name = NULL,
        business_description = NULL,
        business_category = NULL,
        business_phone = NULL,
        business_email = NULL,
        business_website = NULL,
        business_address = NULL,
        business_logo = NULL,
        business_cover = NULL
      WHERE id = $1
      RETURNING *;
      `,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Business Mode disabled successfully.',
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

module.exports = disableBusinessMode;