const pool = require('../../../config/db');

const getCommunityPosts = async (req, res) => {

  try {

    const { community_id } = req.params;

    const result =
    await pool.query(
      `
      SELECT *
      FROM community_posts
      WHERE community_id = $1
      ORDER BY created_at DESC;
      `,
      [community_id]
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

module.exports = getCommunityPosts;