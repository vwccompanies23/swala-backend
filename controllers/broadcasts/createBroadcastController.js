const pool = require('../../config/db');

const createBroadcast = async (req, res) => {

  try {

    const {

      creatorId,

      name,

      description,

      photo,

      members,

    } = req.body;

    if (!creatorId) {

      return res.status(400).json({

        success: false,

        error: "Creator ID is required.",

      });

    }

    if (!name || name.trim() === "") {

      return res.status(400).json({

        success: false,

        error: "Broadcast name is required.",

      });

    }

    const broadcastResult =
        await pool.query(

      `

      INSERT INTO broadcasts (

        creator_id,

        name,

        description,

        photo

      )

      VALUES (

        $1,

        $2,

        $3,

        $4

      )

      RETURNING *;

      `,

      [

        creatorId,

        name.trim(),

        description ?? "",

        photo ?? "",

      ],

    );

    const broadcast =
        broadcastResult.rows[0];

    // Creator automatically joins

    await pool.query(

      `

      INSERT INTO broadcast_members (

        broadcast_id,

        user_id

      )

      VALUES (

        $1,

        $2

      )

      ON CONFLICT DO NOTHING;

      `,

      [

        broadcast.id,

        creatorId,

      ],

    );

    // Add recipients

    if (

      Array.isArray(members) &&

      members.length > 0

    ) {

      for (const memberId of members) {

        await pool.query(

          `

          INSERT INTO broadcast_members (

            broadcast_id,

            user_id

          )

          VALUES (

            $1,

            $2

          )

          ON CONFLICT DO NOTHING;

          `,

          [

            broadcast.id,

            memberId,

          ],

        );

      }

    }

    return res.status(201).json({

      success: true,

      message:
          "Broadcast created successfully.",

      broadcast,

    });

  } catch (error) {

    console.error(

      "Create Broadcast Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
createBroadcast;