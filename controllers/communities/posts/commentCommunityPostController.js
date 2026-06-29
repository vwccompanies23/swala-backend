const pool = require('../../../config/db');

const commentCommunityPost = async (req, res) => {

  try {

    const {
      post_id,
      user_id,
      comment
    } = req.body;

    const result =
    await pool.query(
      `
      INSERT INTO community_post_comments
      (
        post_id,
        user_id,
        comment
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *;
      `,
      [
        post_id,
        user_id,
        comment
      ]
    );

    await pool.query(
      `
      UPDATE community_posts
      SET comments_count = (
        SELECT COUNT(*)
        FROM community_post_comments
        WHERE post_id = $1
      )
      WHERE id = $1;
      `,
      [post_id]
    );

    res.status(201).json({
      success: true,
      comment: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

module.exports = commentCommunityPost;