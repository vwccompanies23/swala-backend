const pool = require('../../config/db');

const updateMemberRole = async (req, res) => {

  try {

    const {
      community_id,
      user_id,
      role
    } = req.body;

    const result =
    await pool.query(
      `
      UPDATE community_members
      SET

      role = $1,

      updated_at = CURRENT_TIMESTAMP

      WHERE community_id = $2

      AND user_id = $3

      RETURNING *;
      `,
      [
        role,
        community_id,
        user_id
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: 'Member not found'

      });

    }

    res.status(200).json({

      success: true,

      member: result.rows[0]

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = updateMemberRole;