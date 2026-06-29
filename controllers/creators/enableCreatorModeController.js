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

    const result = await pool.query(
      `
      UPDATE users
      SET
        is_creator = TRUE,
        creator_name = $1,
        creator_category = $2,
        creator_bio = $3,
        creator_cover = $4

      WHERE id = $5
      RETURNING
        id,
        full_name,
        username,
        is_creator,
        creator_name,
        creator_category,
        creator_bio,
        creator_cover;
      `,
      [
        creator_name,
        creator_category,
        creator_bio,
        creator_cover,
        user_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      message: 'Creator mode enabled successfully.',
      creator: result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};