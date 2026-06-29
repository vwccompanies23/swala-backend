const pool = require('../../../config/db');

const deleteCommunityPost = async (req, res) => {

  try {

    const { id } = req.params;

    const result =
    await pool.query(
      `
      DELETE FROM community_posts
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });

    }

    await pool.query(
      `
      UPDATE communities
      SET posts_count = posts_count - 1
      WHERE id = $1;
      `,
      [result.rows[0].community_id]
    );

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

module.exports = deleteCommunityPost;