const pool = require('../../config/db');

const leaveCommunity = async (req, res) => {

  try {

    const {
      community_id,
      user_id
    } = req.body;

    const result =
    await pool.query(
      `
      DELETE FROM community_members
      WHERE community_id = $1
      AND user_id = $2
      RETURNING *;
      `,
      [
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

    await pool.query(
      `
      UPDATE communities
      SET members_count = members_count - 1
      WHERE id = $1;
      `,
      [community_id]
    );

    res.status(200).json({

      success: true,

      message: 'Left community successfully'

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = leaveCommunity;