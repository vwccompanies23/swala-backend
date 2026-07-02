const pool = require('../../config/db');

const getBroadcastLinks = async (req, res) => {

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

        bl.id,

        bl.message_id,

        bl.broadcast_id,

        bl.sender_id,

        bl.url,

        bl.title,

        bl.description,

        bl.image,

        bl.domain,

        bl.created_at,

        u.full_name,

        u.username,

        u.profile_image

      FROM broadcast_links bl

      INNER JOIN users u

        ON bl.sender_id = u.id

      WHERE bl.broadcast_id = $1

      ORDER BY bl.created_at DESC;

      `,

      [

        broadcastId,

      ],

    );

    return res.json({

      success: true,

      totalLinks: result.rows.length,

      links: result.rows,

    });

  } catch (error) {

    console.error(

      "Get Broadcast Links Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
getBroadcastLinks;