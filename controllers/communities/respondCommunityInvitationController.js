const pool = require('../../config/db');

const respondCommunityInvitation = async (req, res) => {

  try {

    const {
      invitation_id,
      status
    } = req.body;

    const result =
    await pool.query(
      `
      UPDATE community_invitations
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
      `,
      [
        status,
        invitation_id
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Invitation not found"

      });

    }

    res.status(200).json({

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

module.exports = respondCommunityInvitation;