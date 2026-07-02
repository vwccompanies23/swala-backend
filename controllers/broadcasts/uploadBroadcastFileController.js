const pool = require('../../config/db');

const uploadBroadcastFile = async (req, res) => {

  try {

    const {

      messageId,

      broadcastId,

      senderId,

      fileName,

      fileUrl,

      fileExtension,

      mimeType,

      fileSize,

    } = req.body;

    if (

      !messageId ||

      !broadcastId ||

      !senderId ||

      !fileName ||

      !fileUrl

    ) {

      return res.status(400).json({

        success: false,

        error: "Missing required fields.",

      });

    }

    const result = await pool.query(

      `

      INSERT INTO broadcast_files (

        message_id,

        broadcast_id,

        sender_id,

        file_name,

        file_url,

        file_extension,

        mime_type,

        file_size

      )

      VALUES (

        $1,

        $2,

        $3,

        $4,

        $5,

        $6,

        $7,

        $8

      )

      RETURNING *;

      `,

      [

        messageId,

        broadcastId,

        senderId,

        fileName,

        fileUrl,

        fileExtension ?? "",

        mimeType ?? "",

        fileSize ?? 0,

      ],

    );

    return res.status(201).json({

      success: true,

      file: result.rows[0],

    });

  } catch (error) {

    console.error(

      "Upload Broadcast File Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
uploadBroadcastFile;