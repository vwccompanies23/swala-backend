const pool = require('../../config/db');

const getBroadcastMedia = async (req, res) => {

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

        bm.id,

        bm.message_id,

        bm.broadcast_id,

        bm.sender_id,

        bm.media_type,

        bm.media_url,

        bm.thumbnail_url,

        bm.width,

        bm.height,

        bm.duration,

        bm.size,

        bm.created_at,

        u.full_name,

        u.username,

        u.profile_image

      FROM broadcast_media bm

      INNER JOIN users u

        ON bm.sender_id = u.id

      WHERE bm.broadcast_id = $1

      ORDER BY bm.created_at DESC;

      `,

      [

        broadcastId,

      ],

    );

    return res.json({

      success: true,

      totalMedia: result.rows.length,

      media: result.rows,

    });

  } catch (error) {

    console.error(

      "Get Broadcast Media Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
getBroadcastMedia;