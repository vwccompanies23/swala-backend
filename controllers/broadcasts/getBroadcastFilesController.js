const pool = require('../../config/db');

const getBroadcastFiles = async (req, res) => {

  try {

    const { broadcastId } = req.params;

    if (!broadcastId) {

      return res.status(400).json({

        success: false,

        error: "Broadcast ID is required.",

      });

    }

    const result = await pool.query(

      `

      SELECT

        bf.id,

        bf.message_id,

        bf.broadcast_id,

        bf.sender_id,

        bf.file_name,

        bf.file_url,

        bf.file_extension,

        bf.mime_type,

        bf.file_size,

        bf.downloaded_count,

        bf.created_at,

        u.full_name,

        u.username,

        u.profile_image

      FROM broadcast_files bf

      INNER JOIN users u

        ON bf.sender_id = u.id

      WHERE bf.broadcast_id = $1

      ORDER BY bf.created_at DESC;

      `,

      [

        broadcastId,

      ],

    );

    return res.json({

      success: true,

      totalFiles: result.rows.length,

      files: result.rows,

    });

  } catch (error) {

    console.error(

      "Get Broadcast Files Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
getBroadcastFiles;