const pool = require('../../config/db');

const getTrending = async (req, res) => {
  try {
    // Trending Posts
    const postsResult = await pool.query(`
      SELECT
        p.id,
        p.user_id,
        p.content,
        p.image_url,
        p.video_url,
        p.created_at,
        u.full_name,
        u.username,
        u.profile_image,
        COUNT(DISTINCT l.id) AS likes_count,
        COUNT(DISTINCT c.id) AS comments_count
      FROM posts p
      JOIN users u
        ON p.user_id = u.id
      LEFT JOIN likes l
        ON l.post_id = p.id
      LEFT JOIN comments c
        ON c.post_id = p.id
      GROUP BY
        p.id,
        u.id
      ORDER BY
        likes_count DESC,
        comments_count DESC,
        p.created_at DESC
      LIMIT 20;
    `);

    // Trending Users
    const usersResult = await pool.query(`
      SELECT
        id,
        full_name,
        username,
        profile_image,
        followers_count,
        posts_count,
        is_verified
      FROM users
      ORDER BY
        followers_count DESC,
        posts_count DESC
      LIMIT 20;
    `);

    res.status(200).json({
      success: true,
      trending_posts: postsResult.rows,
      trending_users: usersResult.rows,
      trending_hashtags: []
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};

module.exports = getTrending;