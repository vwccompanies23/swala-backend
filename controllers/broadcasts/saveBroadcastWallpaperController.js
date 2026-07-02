const pool = require('../../config/db');

const saveBroadcastWallpaper = async (req, res) => {

  try {

    const {

      broadcastId,

      userId,

      wallpaperType,

      wallpaperPath,

      wallpaperColor,

    } = req.body;

    if (!broadcastId || !userId) {

      return res.status(400).json({

        success: false,

        error: "Broadcast ID and User ID are required.",

      });

    }

    const result = await pool.query(

      `

      INSERT INTO broadcast_wallpapers (

        broadcast_id,

        user_id,

        wallpaper_type,

        wallpaper_path,

        wallpaper_color

      )

      VALUES (

        $1,

        $2,

        $3,

        $4,

        $5

      )

      ON CONFLICT (

        broadcast_id,

        user_id

      )

      DO UPDATE

      SET

        wallpaper_type = EXCLUDED.wallpaper_type,

        wallpaper_path = EXCLUDED.wallpaper_path,

        wallpaper_color = EXCLUDED.wallpaper_color,

        updated_at = CURRENT_TIMESTAMP

      RETURNING *;

      `,

      [

        broadcastId,

        userId,

        wallpaperType ?? "default",

        wallpaperPath ?? "",

        wallpaperColor ?? "",

      ],

    );

    return res.json({

      success: true,

      wallpaper: result.rows[0],

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

};

module.exports =
saveBroadcastWallpaper;