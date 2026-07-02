const pool = require('../../config/db');

const removeBroadcastReaction = async (req, res) => {

  try {

    const {

      messageId,

      userId,

    } = req.body;

    if (

      !messageId ||

      !userId

    ) {

      return res.status(400).json({

        success: false,

        error: "Message ID and User ID are required.",

      });

    }

    const result = await pool.query(

      `

      DELETE FROM broadcast_reactions

      WHERE

        message_id = $1

      AND

        user_id = $2

      RETURNING *;

      `,

      [

        messageId,

        userId,

      ],

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        error: "Reaction not found.",

      });

    }

    return res.json({

      success: true,

      message:

        "Reaction removed successfully.",

      reaction:

        result.rows[0],

    });

  } catch (error) {

    console.error(

      "Remove Broadcast Reaction Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
removeBroadcastReaction;