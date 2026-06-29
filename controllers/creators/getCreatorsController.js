const pool = require('../../config/db');

module.exports = async (req, res) => {
  try {

    const {
      page = 1,
      limit = 20,
      category = '',
      search = ''
    } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT
        id,
        full_name,
        username,
        profile_image,
        cover_image,
        bio,
        is_verified,
        is_creator,
        creator_name,
        creator_category,
        creator_bio,
        creator_cover,
        followers_count,
        following_count,
        posts_count,
        created_at
      FROM users
      WHERE is_creator = TRUE
    `;

    const values = [];

    if (category) {
      values.push(category);

      query += `
        AND creator_category = $${values.length}
      `;
    }

    if (search) {
      values.push(`%${search}%`);

      query += `
        AND (
          creator_name ILIKE $${values.length}
          OR username ILIKE $${values.length}
          OR full_name ILIKE $${values.length}
        )
      `;
    }

    values.push(limit);

    query += `
      ORDER BY
        followers_count DESC,
        posts_count DESC
      LIMIT $${values.length}
    `;

    values.push(offset);

    query += `
      OFFSET $${values.length};
    `;

    const result = await pool.query(
      query,
      values
    );

    res.status(200).json({
      success: true,
      total: result.rows.length,
      creators: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};