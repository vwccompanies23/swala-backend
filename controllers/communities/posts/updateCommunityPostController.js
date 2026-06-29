const pool = require('../../../config/db');

const updateCommunityPost = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      content,
      media_url,
      media_type
    } = req.body;

    const result =
    await pool.query(
      `
      UPDATE community_posts
      SET
        content = $1,
        media_url = $2,
        media_type = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
      `,
      [
        content,
        media_url,
        media_type,
        id
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: 'Post not found'

      });

    }

    res.status(200).json({

      success: true,

      post: result.rows[0]

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = updateCommunityPost;