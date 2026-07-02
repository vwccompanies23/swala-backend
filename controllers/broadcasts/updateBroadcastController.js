const pool = require('../../config/db');

const updateBroadcast = async (req, res) => {

  try {

    const {

      broadcastId,

      name,

      description,

      photo,

    } = req.body;

    if (!broadcastId) {

      return res.status(400).json({

        success: false,

        error: "Broadcast ID is required.",

      });

    }

    const result = await pool.query(

      `

      UPDATE broadcasts

      SET

        name = COALESCE($1, name),

        description = COALESCE($2, description),

        photo = COALESCE($3, photo),

        updated_at = CURRENT_TIMESTAMP

      WHERE id = $4

      RETURNING *;

      `,

      [

        name,

        description,

        photo,

        broadcastId,

      ],

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        error: "Broadcast not found.",

      });

    }

    return res.json({

      success: true,

      message:
          "Broadcast updated successfully.",

      broadcast: result.rows[0],

    });

  } catch (error) {

    console.error(

      "Update Broadcast Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports = updateBroadcast;