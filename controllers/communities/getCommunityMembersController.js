const pool = require('../../config/db');

const getCommunityMembers = async (req, res) => {

  try {

    const { community_id } = req.params;

    const result =
    await pool.query(
      `
      SELECT

        cm.*,

        u.full_name,

        u.username,

        u.profile_picture

      FROM community_members cm

      JOIN users u

      ON cm.user_id = u.id

      WHERE cm.community_id = $1

      ORDER BY

      cm.role DESC,

      u.full_name ASC;
      `,
      [community_id]
    );

    res.status(200).json({

      success: true,

      members: result.rows

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = getCommunityMembers;