const pool = require('../../config/db');

const addBroadcastMembers = async (req, res) => {

  try {

    const {

      broadcastId,

      members,

    } = req.body;

    if (!broadcastId) {

      return res.status(400).json({

        success: false,

        error: "Broadcast ID is required.",

      });

    }

    if (

      !Array.isArray(members) ||

      members.length === 0

    ) {

      return res.status(400).json({

        success: false,

        error: "No members selected.",

      });

    }

    const addedMembers = [];

    for (const userId of members) {

      const result = await pool.query(

        `

        INSERT INTO broadcast_members (

          broadcast_id,

          user_id

        )

        VALUES (

          $1,

          $2

        )

        ON CONFLICT (

          broadcast_id,

          user_id

        )

        DO NOTHING

        RETURNING *;

        `,

        [

          broadcastId,

          userId,

        ],

      );

      if (result.rows.length > 0) {

        addedMembers.push(

          result.rows[0],

        );

      }

    }

    return res.json({

      success: true,

      message:

        "Members added successfully.",

      members: addedMembers,

    });

  } catch (error) {

    console.error(

      "Add Broadcast Members Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports = addBroadcastMembers;