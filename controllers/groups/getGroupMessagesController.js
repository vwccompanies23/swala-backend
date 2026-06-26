const pool = require('../../config/db');

const getGroupMessages = async (
  req,
  res
) => {

  try {

    const {
      group_id
    } = req.params;

    const result = await pool.query(
      `
      SELECT
        gm.id,
        gm.group_id,
        gm.sender_id,

        u.full_name,
        u.username,
        u.profile_image,

        gm.message,
        gm.image_url,
        gm.video_url,
        gm.audio_url,

        gm.created_at

      FROM group_messages gm

      JOIN users u
      ON gm.sender_id = u.id

      WHERE gm.group_id = $1

      ORDER BY gm.created_at ASC
      `,
      [group_id]
    );

    res.json({
      success: true,
      messages:
      result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports =
getGroupMessages;