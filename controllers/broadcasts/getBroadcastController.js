const pool = require('../../config/db');

const getBroadcast = async (req, res) => {

  try {

    const { id } = req.params;

    if (!id) {

      return res.status(400).json({

        success: false,

        error: "Broadcast ID is required.",

      });

    }

    // Broadcast Information
    const broadcastResult = await pool.query(

      `

      SELECT

        b.*,

        u.full_name AS creator_name,

        u.username AS creator_username,

        u.profile_image AS creator_photo

      FROM broadcasts b

      JOIN users u

        ON u.id = b.creator_id

      WHERE b.id = $1

      LIMIT 1;

      `,

      [id],

    );

    if (broadcastResult.rows.length === 0) {

      return res.status(404).json({

        success: false,

        error: "Broadcast not found.",

      });

    }

    // Members
    const membersResult = await pool.query(

      `

      SELECT

        u.id,

        u.full_name,

        u.username,

        u.phone,

        u.profile_image,

        bm.joined_at

      FROM broadcast_members bm

      JOIN users u

        ON u.id = bm.user_id

      WHERE bm.broadcast_id = $1

      ORDER BY u.full_name ASC;

      `,

      [id],

    );

    // Latest Message
    const lastMessageResult = await pool.query(

      `

      SELECT

        id,

        sender_id,

        message,

        message_type,

        created_at

      FROM broadcast_messages

      WHERE broadcast_id = $1

      ORDER BY created_at DESC

      LIMIT 1;

      `,

      [id],

    );

    return res.json({

      success: true,

      broadcast: {

        ...broadcastResult.rows[0],

        members: membersResult.rows,

        member_count:
            membersResult.rows.length,

        last_message:

            lastMessageResult.rows[0] ??

            null,

      },

    });

  } catch (error) {

    console.error(

      "Get Broadcast Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports = getBroadcast;