const pool = require("../../config/db");

const rejectCall = async (req, res) => {

  try {

    const { callId } = req.params;
    const { ended_by } = req.body;

    console.log(`📞 Rejecting call ${callId}`);

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

    if (
      existing.rows[0].status === "ended" ||
      existing.rows[0].status === "rejected"
    ) {

      return res.status(200).json({

        success: true,

        message: "Call already closed.",

        call: existing.rows[0],

      });

    }

    /*
    ==========================================
    REJECT CALL
    ==========================================
    */

    const result = await pool.query(

      `
      UPDATE calls
      SET
        status = 'rejected',
        ended_at = CURRENT_TIMESTAMP,
        ended_by = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
      `,

      [
        callId,
        ended_by,
      ],

    );

    /*
    ==========================================
    SAVE CALL HISTORY
    ==========================================
    */

   /*
   ==========================================
   UPDATE CALL HISTORY
   ==========================================
   */

   await pool.query(

     `
     UPDATE call_history
     SET
       status = 'rejected',
       ended_by = $2,
       ended_at = CURRENT_TIMESTAMP
     WHERE call_id = $1;
     `,

     [
       callId,
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

      [result.rows[0].caller_id],

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

      [result.rows[0].receiver_id],

    );

    console.log(`✅ Call ${callId} rejected`);

    res.status(200).json({

      success: true,

      message: "Call rejected successfully.",

      call: result.rows[0],

      caller: caller.rows[0],

      receiver: receiver.rows[0],

    });

  } catch (error) {

    console.error("❌ Reject Call Error");
    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to reject call.",

      error: error.message,

    });

  }

};

module.exports = rejectCall;