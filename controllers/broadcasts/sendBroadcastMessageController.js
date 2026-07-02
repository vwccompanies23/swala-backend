const pool = require('../../config/db');

const sendBroadcastMessage = async (req, res) => {

  try {

    const {

      broadcastId,

      senderId,

      message,

      messageType,

      mediaUrl,

      thumbnailUrl,

      fileName,

      fileSize,

      mimeType,

      replyTo,

      forwarded,

      metadata,

    } = req.body;

    if (!broadcastId || !senderId) {

      return res.status(400).json({

        success: false,

        error: "Broadcast ID and Sender ID are required.",

      });

    }

    const result = await pool.query(

      `

      INSERT INTO broadcast_messages (

        broadcast_id,

        sender_id,

        message,

        message_type,

        media_url,

        thumbnail_url,

        file_name,

        file_size,

        mime_type,

        reply_to,

        forwarded,

        metadata

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

        $10,

        $11,

        $12

      )

      RETURNING *;

      `,

      [

        broadcastId,

        senderId,

        message ?? "",

        messageType ?? "text",

        mediaUrl ?? "",

        thumbnailUrl ?? "",

        fileName ?? "",

        fileSize ?? 0,

        mimeType ?? "",

        replyTo ?? null,

        forwarded ?? false,

        metadata ?? null,

      ],

    );

    const newMessage = result.rows[0];

    // Create delivery records for every recipient

    const members = await pool.query(

      `

      SELECT user_id

      FROM broadcast_members

      WHERE broadcast_id = $1;

      `,

      [

        broadcastId,

      ],

    );

    for (const member of members.rows) {

      await pool.query(

        `

        INSERT INTO broadcast_reads (

          message_id,

          broadcast_id,

          user_id

        )

        VALUES (

          $1,

          $2,

          $3

        )

        ON CONFLICT DO NOTHING;

        `,

        [

          newMessage.id,

          broadcastId,

          member.user_id,

        ],

      );

    }

    return res.status(201).json({

      success: true,

      message: "Broadcast message sent.",

      data: newMessage,

    });

  } catch (error) {

    console.error(

      "Send Broadcast Message Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports = sendBroadcastMessage;