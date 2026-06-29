const pool = require('../../config/db');

const joinCommunity = async (req, res) => {

  try {

    const {
      community_id,
      user_id
    } = req.body;

    const community = await pool.query(
      `
      SELECT *
      FROM communities
      WHERE id = $1;
      `,
      [community_id]
    );

    if (community.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Community not found"

      });

    }

    const role = "member";

    const status = community.rows[0].is_private
      ? "pending"
      : "active";

    await pool.query(
      `
      INSERT INTO community_members
      (
        community_id,
        user_id,
        role,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      ON CONFLICT
      (community_id, user_id)
      DO NOTHING;
      `,
      [
        community_id,
        user_id,
        role,
        status
      ]
    );

    if (status === "active") {

      await pool.query(
        `
        UPDATE communities
        SET members_count = members_count + 1
        WHERE id = $1;
        `,
        [community_id]
      );

    }

    res.status(200).json({

      success: true,

      status,

      message: status === "active"
          ? "Joined community successfully"
          : "Join request sent"

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = joinCommunity;