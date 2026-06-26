const pool = require('../../config/db');

const getGroupAdmins = async (
  req,
  res
) => {

  try {

    const {
      group_id
    } = req.params;

    const result =
    await pool.query(
      `
      SELECT
        gm.id,
        gm.group_id,
        gm.user_id,
        gm.is_admin,

        u.full_name,
        u.username,
        u.phone,
        u.profile_image

      FROM group_members gm

      JOIN users u
      ON gm.user_id = u.id

      WHERE gm.group_id = $1
      AND gm.is_admin = true

      ORDER BY u.full_name ASC
      `,
      [group_id]
    );

    res.json({
      success: true,
      admins: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports =
getGroupAdmins;