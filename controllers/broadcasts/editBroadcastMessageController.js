const pool = require('../../config/db');

const editBroadcastMessage = async (req, res) => {

  try {

    const {

      messageId,

      message,

    } = req.body;

    if (!messageId) {

      return res.status(400).json({

        success: false,

        error: "Message ID is required.",

      });

    }

    if (!message || message.trim() === "") {

      return res.status(400).json({

        success: false,

        error: "Message cannot be empty.",

      });

    }

    const result = await pool.query(

      `

      UPDATE broadcast_messages

      SET

        message = $1,

        edited = TRUE,

        updated_at = CURRENT_TIMESTAMP

      WHERE id = $2

      RETURNING *;

      `,

      [

        message.trim(),

        messageId,

      ],

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        error: "Message not found.",

      });

    }

    return res.json({

      success: true,

      message: "Message updated successfully.",

      data: result.rows[0],

    });

  } catch (error) {

    console.error(

      "Edit Broadcast Message Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
editBroadcastMessage;