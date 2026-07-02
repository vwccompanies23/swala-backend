const pool = require('../../config/db');

const addBroadcastReaction = async (req, res) => {

  try {

    const {

      messageId,

      broadcastId,

      userId,

      reaction,

    } = req.body;

    if (

      !messageId ||

      !broadcastId ||

      !userId ||

      !reaction

    ) {

      return res.status(400).json({

        success: false,

        error: "Missing required fields.",

      });

    }

    const result = await pool.query(

      `

      INSERT INTO broadcast_reactions (

        message_id,

        broadcast_id,

        user_id,

        reaction

      )

      VALUES (

        $1,

        $2,

        $3,

        $4

      )

      ON CONFLICT (

        message_id,

        user_id

      )

      DO UPDATE

      SET

        reaction = EXCLUDED.reaction,

        updated_at = CURRENT_TIMESTAMP

      RETURNING *;

      `,

      [

        messageId,

        broadcastId,

        userId,

        reaction,

      ],

    );

    return res.json({

      success: true,

      reaction: result.rows[0],

    });

  } catch (error) {

    console.error(

      "Add Broadcast Reaction Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
addBroadcastReaction;