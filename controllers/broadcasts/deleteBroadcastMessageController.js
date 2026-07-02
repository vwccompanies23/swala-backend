const pool = require('../../config/db');

const deleteBroadcastMessage = async (req, res) => {

  try {

    const {

      messageId,

    } = req.body;

    if (!messageId) {

      return res.status(400).json({

        success: false,

        error: "Message ID is required.",

      });

    }

    const result = await pool.query(

      `

      UPDATE broadcast_messages

      SET

        deleted = TRUE,

        message = 'This message was deleted.',

        media_url = '',

        thumbnail_url = '',

        file_name = '',

        file_size = 0,

        mime_type = '',

        updated_at = CURRENT_TIMESTAMP

      WHERE id = $1

      RETURNING *;

      `,

      [

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

      message:
        "Message deleted successfully.",

      data: result.rows[0],

    });

  } catch (error) {

    console.error(

      "Delete Broadcast Message Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
deleteBroadcastMessage;