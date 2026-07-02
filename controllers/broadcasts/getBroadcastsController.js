const pool = require('../../config/db');

const getBroadcasts = async (req, res) => {

  try {

    const { userId } = req.params;

    if (!userId) {

      return res.status(400).json({

        success: false,

        error: "User ID is required.",

      });

    }

    const result = await pool.query(

      `

      SELECT

        b.id,

        b.name,

        b.description,

        b.photo,

        b.creator_id,

        b.created_at,

        COUNT(DISTINCT bm.user_id)
          AS member_count,

        (

          SELECT message

          FROM broadcast_messages

          WHERE broadcast_id = b.id

          ORDER BY created_at DESC

          LIMIT 1

        ) AS last_message,

        (

          SELECT created_at

          FROM broadcast_messages

          WHERE broadcast_id = b.id

          ORDER BY created_at DESC

          LIMIT 1

        ) AS last_message_time

      FROM broadcasts b

      INNER JOIN broadcast_members bm

        ON bm.broadcast_id = b.id

      WHERE b.id IN (

        SELECT broadcast_id

        FROM broadcast_members

        WHERE user_id = $1

      )

      GROUP BY

        b.id

      ORDER BY

        last_message_time DESC NULLS LAST,

        b.created_at DESC;

      `,

      [

        userId,

      ],

    );

    return res.json({

      success: true,

      broadcasts: result.rows,

    });

  } catch (error) {

    console.error(

      "Get Broadcasts Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
getBroadcasts;