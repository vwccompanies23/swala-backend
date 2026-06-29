const pool = require('../../config/db');

const getBusinesses = async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      page = 1,
      limit = 20,
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
        business_name,
        business_description,
        business_category,
        business_phone,
        business_email,
        business_website,
        business_address,
        business_logo,
        business_cover,
        followers_count,
        posts_count,
        is_verified,
        created_at
      FROM users
      WHERE is_business = TRUE
    `;

    const values = [];

    if (search) {
      values.push(`%${search}%`);

      query += `
        AND (
          business_name ILIKE $${values.length}
          OR username ILIKE $${values.length}
        )
      `;
    }

    if (category) {
      values.push(category);

      query += `
        AND business_category = $${values.length}
      `;
    }

    values.push(limit);

    query += `
      ORDER BY business_name ASC
      LIMIT $${values.length}
    `;

    values.push(offset);

    query += `
      OFFSET $${values.length};
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      total: result.rows.length,
      businesses: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = getBusinesses;