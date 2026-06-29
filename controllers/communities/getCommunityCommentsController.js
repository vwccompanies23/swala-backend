const pool = require('../../config/db');

const getCommunityComments = async (req, res) => {

  try {

    const { post_id } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.*,
        u.id AS user_id,
        u.full_name,
        u.profile_picture
      FROM community_post_comments c
      JOIN users u
      ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC;
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

module.exports = getCommunityComments;