const pool = require('../../config/db');

const getBroadcastMembers = async (req, res) => {

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

        u.id,

        u.full_name,

        u.username,

        u.phone,

        u.profile_image,

        u.is_online,

        bm.joined_at,

        CASE

          WHEN b.creator_id = u.id

          THEN TRUE

          ELSE FALSE

        END AS is_creator

      FROM broadcast_members bm

      INNER JOIN users u

        ON bm.user_id = u.id

      INNER JOIN broadcasts b

        ON bm.broadcast_id = b.id

      WHERE bm.broadcast_id = $1

      ORDER BY

        is_creator DESC,

        u.full_name ASC;

      `,

      [

        broadcastId,

      ],

    );

    return res.json({

      success: true,

      totalMembers: result.rows.length,

      members: result.rows,

    });

  } catch (error) {

    console.error(

      "Get Broadcast Members Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports = getBroadcastMembers;