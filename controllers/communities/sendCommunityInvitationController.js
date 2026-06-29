const pool = require('../../config/db');

const sendCommunityInvitation = async (req, res) => {

  try {

    const {
      community_id,
      invited_by,
      invited_user
    } = req.body;

    const result =
    await pool.query(
      `
      INSERT INTO community_invitations
      (
        community_id,
        invited_by,
        invited_user
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *;
      `,
      [
        community_id,
        invited_by,
        invited_user
      ]
    );

    res.status(201).json({

      success: true,

      invitation: result.rows[0]

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = sendCommunityInvitation;