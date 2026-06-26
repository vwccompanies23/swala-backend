const pool = require('../../config/db');

const uploadGroupVideo = async (
  req,
  res
) => {

  try {

    const {
      group_id,
      sender_id,
      video_url
    } = req.body;

    const result =
    await pool.query(
      `
      INSERT INTO group_messages
      (
        group_id,
        sender_id,
        video_url
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *
      `,
      [
        group_id,
        sender_id,
        video_url
      ]
    );

    res.status(201).json({
      success: true,
      video: result.rows[0]
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
uploadGroupVideo;