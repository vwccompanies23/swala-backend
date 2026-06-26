const pool = require('../../config/db');

const getComments = async (req, res) => {
  try {

    const { post_id } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.*,
        u.full_name,
        u.username,
        u.profile_image
      FROM comments c
      LEFT JOIN users u
      ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
      `,
      [post_id]
    );

    res.status(200).json({
      success: true,
      comments: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = getComments;