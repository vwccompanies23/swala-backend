const pool = require('../../config/db');

const searchBroadcastMessages = async (req, res) => {

  try {

    const {

      broadcastId,

      query,

    } = req.query;

    if (!broadcastId) {

      return res.status(400).json({

        success: false,

        error: "Broadcast ID is required.",

      });

    }

    if (!query || query.trim() === "") {

      return res.status(400).json({

        success: false,

        error: "Search query is required.",

      });

    }

    const result = await pool.query(

      `

      SELECT

        bm.*,

        u.full_name,

        u.username,

        u.profile_image

      FROM broadcast_messages bm

      INNER JOIN users u

        ON u.id = bm.sender_id

      WHERE

        bm.broadcast_id = $1

      AND

        LOWER(bm.message)

        LIKE

        LOWER($2)

      ORDER BY

        bm.created_at DESC;

      `,

      [

        broadcastId,

        `%${query}%`,

      ],

    );

    return res.json({

      success: true,

      totalResults:

        result.rows.length,

      messages:

        result.rows,

    });

  } catch (error) {

    console.error(

      "Search Broadcast Messages Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
searchBroadcastMessages;