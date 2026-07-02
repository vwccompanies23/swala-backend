const pool = require('../../config/db');

const uploadBroadcastMedia = async (req, res) => {

  try {

    const {

      messageId,

      broadcastId,

      senderId,

      mediaType,

      mediaUrl,

      thumbnailUrl,

      width,

      height,

      duration,

      size,

    } = req.body;

    if (

      !messageId ||

      !broadcastId ||

      !senderId ||

      !mediaType ||

      !mediaUrl

    ) {

      return res.status(400).json({

        success: false,

        error: "Missing required fields.",

      });

    }

    const result = await pool.query(

      `

      INSERT INTO broadcast_media (

        message_id,

        broadcast_id,

        sender_id,

        media_type,

        media_url,

        thumbnail_url,

        width,

        height,

        duration,

        size

      )

      VALUES (

        $1,

        $2,

        $3,

        $4,

        $5,

        $6,

        $7,

        $8,

        $9,

        $10

      )

      RETURNING *;

      `,

      [

        messageId,

        broadcastId,

        senderId,

        mediaType,

        mediaUrl,

        thumbnailUrl ?? "",

        width ?? 0,

        height ?? 0,

        duration ?? 0,

        size ?? 0,

      ],

    );

    return res.status(201).json({

      success: true,

      media: result.rows[0],

    });

  } catch (error) {

    console.error(

      "Upload Broadcast Media Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
uploadBroadcastMedia;