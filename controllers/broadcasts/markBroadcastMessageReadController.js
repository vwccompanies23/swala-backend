const pool = require('../../config/db');

const markBroadcastMessageRead = async (req, res) => {

  try {

    const {

      messageId,

      userId,

    } = req.body;

    if (!messageId || !userId) {

      return res.status(400).json({

        success: false,

        error: "Message ID and User ID are required.",

      });

    }

    const result = await pool.query(

      `

      UPDATE broadcast_reads

      SET

        delivered = TRUE,

        delivered_at = COALESCE(

          delivered_at,

          CURRENT_TIMESTAMP

        ),

        read = TRUE,

        read_at = CURRENT_TIMESTAMP

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

        error: "Read record not found.",

      });

    }

    return res.json({

      success: true,

      message:

        "Message marked as read.",

      readStatus:

        result.rows[0],

    });

  } catch (error) {

    console.error(

      "Mark Broadcast Read Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
markBroadcastMessageRead;