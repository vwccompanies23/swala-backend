const pool = require("../../config/db");

const getCallHistory = async (req, res) => {
  try {

    const { userId } = req.params;

    const result = await pool.query(
      `
      SELECT

        h.*,

        caller.full_name AS caller_name,
        caller.username AS caller_username,
        caller.profile_image AS caller_photo,

        receiver.full_name AS receiver_name,
        receiver.username AS receiver_username,
        receiver.profile_image AS receiver_photo,

        CASE
          WHEN h.caller_id = $1 THEN TRUE
          ELSE FALSE
        END AS is_outgoing

      FROM call_history h

      LEFT JOIN users caller
      ON h.caller_id = caller.id

      LEFT JOIN users receiver
      ON h.receiver_id = receiver.id

      WHERE
        h.caller_id = $1
        OR
        h.receiver_id = $1

      ORDER BY h.created_at DESC;
      `,
      [userId],
    );

    return res.status(200).json({
      success: true,
      calls: result.rows,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load call history.",
      error: error.message,
    });

  }
};

module.exports = getCallHistory;