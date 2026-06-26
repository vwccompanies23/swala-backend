const pool = require('../../config/db');

const createPost = async (req, res) => {
  try {

    const {
      user_id,
      content,
      image_url
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (
      (!content || content.trim() === '') &&
      (!image_url || image_url.trim() === '')
    ) {
      return res.status(400).json({
        success: false,
        error: 'Post content or image is required'
      });
    }

    const result = await pool.query(
      `
      INSERT INTO posts
      (
        user_id,
        content,
        image_url
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *
      `,
      [
        user_id,
        content,
        image_url
      ]
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

module.exports = createPost;