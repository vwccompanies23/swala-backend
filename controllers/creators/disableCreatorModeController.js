const pool = require('../../config/db');

module.exports = async (req, res) => {
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
      is_creator = FALSE,
      creator_name = NULL,
      creator_category = NULL,
      creator_bio = NULL,
      creator_cover = NULL
    WHERE id = $1
    RETURNING
      id,
      full_name,
      username,
      is_creator;
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
      message: 'Creator Mode disabled successfully.',
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