const pool = require("../../config/db");

const getSecretContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.full_name,
        u.username,
        u.phone,
        u.profile_image,
        u.bio,
        c.contact_name
      FROM contacts c
      INNER JOIN users u
        ON u.id = c.contact_user_id
      WHERE c.user_id = $1
      ORDER BY u.full_name ASC
      `,
      [userId],
    );

    res.json({
      success: true,
      contacts: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = getSecretContacts;