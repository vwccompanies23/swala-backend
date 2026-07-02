const pool = require('../../config/db');

const getBroadcastMessages = async (req, res) => {

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

        bm.*,

        u.full_name,

        u.username,

        u.profile_image,

        (

          SELECT COUNT(*)

          FROM broadcast_reads br

          WHERE

            br.message_id = bm.id

            AND br.delivered = TRUE

        ) AS delivered_count,

        (

          SELECT COUNT(*)

          FROM broadcast_reads br

          WHERE

            br.message_id = bm.id

            AND br.read = TRUE

        ) AS read_count,

        (

          SELECT COALESCE(

            json_agg(

              json_build_object(

                'userId', r.user_id,

                'reaction', r.reaction

              )

            ),

            '[]'

          )

          FROM broadcast_reactions r

          WHERE r.message_id = bm.id

        ) AS reactions

      FROM broadcast_messages bm

      INNER JOIN users u

        ON u.id = bm.sender_id

      WHERE bm.broadcast_id = $1

      ORDER BY bm.created_at ASC;

      `,

      [

        broadcastId,

      ],

    );

    return res.json({

      success: true,

      totalMessages:

        result.rows.length,

      messages:

        result.rows,

    });

  } catch (error) {

    console.error(

      "Get Broadcast Messages Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
getBroadcastMessages;