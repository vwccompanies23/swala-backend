const pool = require("../../config/db");

const endCall = async (req, res) => {
  try {
    const { callId } = req.params;
    const { ended_by } = req.body;

    console.log(`📴 Ending call ${callId}`);

    /*
    ==========================================
    CHECK CALL
    ==========================================
    */

    const existing = await pool.query(
      `
      SELECT *
      FROM calls
      WHERE id = $1;
      `,
      [callId],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Call not found.",
      });
    }

    if (existing.rows[0].status === "ended") {
      return res.status(200).json({
        success: true,
        message: "Call already ended.",
        call: existing.rows[0],
      });
    }

   /*
   ==========================================
   END OR MISS CALL
   ==========================================
   */

   const status =
     existing.rows[0].status === "ringing"
       ? "missed"
       : "ended";

   const result = await pool.query(
     `
     UPDATE calls
     SET
       status = $2,
       ended_at = CURRENT_TIMESTAMP,
       ended_by = $3,
       duration = COALESCE(
         EXTRACT(
           EPOCH FROM (
             CURRENT_TIMESTAMP - started_at
           )
         )::INTEGER,
         0
       ),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *;
     `,
     [
       callId,
       status,
       ended_by,
     ],
   );

    /*
    ==========================================
    UPDATE CALL HISTORY
    ==========================================
    */

    const callStatus =
      result.rows[0].duration == 0
        ? "missed"
        : "ended";

    await pool.query(
      `
      UPDATE call_history
      SET
        status = $2,
        duration = $3,
        ended_by = $4,
        ended_at = CURRENT_TIMESTAMP
      WHERE call_id = $1;
      `,
      [
        callId,
        callStatus,
        result.rows[0].duration,
        ended_by,
      ],
    );

    /*
    ==========================================
    GET CALLER
    ==========================================
    */

    const caller = await pool.query(
      `
      SELECT
        id,
        full_name,
        username,
        profile_image
      FROM users
      WHERE id = $1;
      `,
      [
        result.rows[0].caller_id,
      ],
    );

    /*
    ==========================================
    GET RECEIVER
    ==========================================
    */

    const receiver = await pool.query(
      `
      SELECT
        id,
        full_name,
        username,
        profile_image
      FROM users
      WHERE id = $1;
      `,
      [
        result.rows[0].receiver_id,
      ],
    );

    console.log(`✅ Call ${callId} ended`);

    res.status(200).json({
      success: true,
      message: "Call ended successfully.",
      call: result.rows[0],
      caller: caller.rows[0],
      receiver: receiver.rows[0],
    });

  } catch (error) {
    console.error("❌ End Call Error");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to end call.",
      error: error.message,
    });
  }
};

module.exports = endCall;