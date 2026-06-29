const pool = require('../../../config/db');

const createCommunityPost = async (req, res) => {

  try {

    const {
      community_id,
      author_id,
      content,
      media_url,
      media_type
    } = req.body;

    const result =
    await pool.query(
      `
      INSERT INTO community_posts
      (
        community_id,
        author_id,
        content,
        media_url,
        media_type
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING *;
      `,
      [
        community_id,
        author_id,
        content,
        media_url,
        media_type
      ]
    );

    await pool.query(
      `
      UPDATE communities
      SET posts_count = posts_count + 1
      WHERE id = $1;
      `,
      [community_id]
    );

    res.status(201).json({

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

module.exports = createCommunityPost;