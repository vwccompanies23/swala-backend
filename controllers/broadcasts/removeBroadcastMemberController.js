const pool = require('../../config/db');

const removeBroadcastMember = async (req, res) => {

  try {

    const {

      broadcastId,

      userId,

    } = req.body;

    if (!broadcastId || !userId) {

      return res.status(400).json({

        success: false,

        error: "Broadcast ID and User ID are required.",

      });

    }

    // Check if broadcast exists
    const broadcastResult = await pool.query(

      `

      SELECT creator_id

      FROM broadcasts

      WHERE id = $1;

      `,

      [

        broadcastId,

      ],

    );

    if (broadcastResult.rows.length === 0) {

      return res.status(404).json({

        success: false,

        error: "Broadcast not found.",

      });

    }

    // Prevent removing the creator
    if (

      broadcastResult.rows[0].creator_id ===

      Number(userId)

    ) {

      return res.status(400).json({

        success: false,

        error:
          "The broadcast creator cannot be removed.",

      });

    }

    const result = await pool.query(

      `

      DELETE FROM broadcast_members

      WHERE

        broadcast_id = $1

      AND

        user_id = $2

      RETURNING *;

      `,

      [

        broadcastId,

        userId,

      ],

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        error: "Member not found.",

      });

    }

    return res.json({

      success: true,

      message:
        "Member removed successfully.",

      member: result.rows[0],

    });

  } catch (error) {

    console.error(

      "Remove Broadcast Member Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
removeBroadcastMember;