const pool = require('../../config/db');

const getPosts = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT
        p.*,
        u.full_name,
        u.username,
        u.profile_image
      FROM posts p
      LEFT JOIN users u
      ON p.user_id = u.id
      ORDER BY p.created_at DESC
      `
    );

    res.status(200).json({
      success: true,
      posts: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = getPosts;