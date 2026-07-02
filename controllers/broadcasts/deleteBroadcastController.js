const pool = require('../../config/db');

const deleteBroadcast = async (req, res) => {

  try {

    const { broadcastId } = req.params;

    if (!broadcastId) {

      return res.status(400).json({

        success: false,

        error: "Broadcast ID is required.",

      });

    }

    const exists = await pool.query(

      `

      SELECT id

      FROM broadcasts

      WHERE id = $1;

      `,

      [

        broadcastId,

      ],

    );

    if (exists.rows.length === 0) {

      return res.status(404).json({

        success: false,

        error: "Broadcast not found.",

      });

    }

    await pool.query(

      `

      DELETE FROM broadcasts

      WHERE id = $1;

      `,

      [

        broadcastId,

      ],

    );

    return res.json({

      success: true,

      message:
        "Broadcast deleted successfully.",

    });

  } catch (error) {

    console.error(

      "Delete Broadcast Error:",

      error,

    );

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports = deleteBroadcast;