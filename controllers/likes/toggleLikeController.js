const pool = require('../../config/db');

const toggleLike = async (req, res) => {
  try {

    const {
      post_id,
      user_id
    } = req.body;

    if (!post_id) {
      return res.status(400).json({
        success: false,
        error: 'Post ID is required'
      });
    }

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const existingLike =
      await pool.query(
        `
        SELECT *
        FROM likes
        WHERE post_id = $1
        AND user_id = $2
        `,
        [
          post_id,
          user_id
        ]
      );

    if (
      existingLike.rows.length > 0
    ) {

      await pool.query(
        `
        DELETE FROM likes
        WHERE post_id = $1
        AND user_id = $2
        `,
        [
          post_id,
          user_id
        ]
      );

      const likesCount =
        await pool.query(
          `
          SELECT COUNT(*)
          FROM likes
          WHERE post_id = $1
          `,
          [post_id]
        );

      return res.status(200).json({
        success: true,
        liked: false,
        likes_count:
          parseInt(
            likesCount.rows[0].count
          )
      });
    }

    await pool.query(
      `
      INSERT INTO likes
      (
        post_id,
        user_id
      )
      VALUES
      (
        $1,
        $2
      )
      `,
      [
        post_id,
        user_id
      ]
    );

    const likesCount =
      await pool.query(
        `
        SELECT COUNT(*)
        FROM likes
        WHERE post_id = $1
        `,
        [post_id]
      );

    res.status(200).json({
      success: true,
      liked: true,
      likes_count:
        parseInt(
          likesCount.rows[0].count
        )
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = toggleLike;