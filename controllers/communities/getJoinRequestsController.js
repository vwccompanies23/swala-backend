const pool = require('../../config/db');

const getJoinRequests = async (req, res) => {

  try {

    const { community_id } = req.params;

    const result =
    await pool.query(
      `
      SELECT
        jr.*,
        u.full_name,
        u.username,
        u.profile_picture
      FROM community_join_requests jr
      JOIN users u
      ON jr.user_id = u.id
      WHERE jr.community_id = $1
      ORDER BY jr.created_at ASC;
      `,
      [community_id]
    );

    res.status(200).json({

      success: true,

      requests: result.rows

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = getJoinRequests;