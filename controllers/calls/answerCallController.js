const pool = require("../../config/db");

const answerCall = async (req, res) => {

  try {

    const { callId } = req.params;

    console.log(`📞 Answering call ${callId}`);

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

      return res.status(400).json({

        success: false,

        message: "Call already ended.",

      });

    }

    if (existing.rows[0].status === "accepted") {

      return res.status(200).json({

        success: true,

        message: "Call already answered.",

        call: existing.rows[0],

      });

    }

    /*
    ==========================================
    ANSWER CALL
    ==========================================
    */

    const result = await pool.query(

      `
      UPDATE calls
      SET
        status = 'accepted',
        started_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
      `,

      [callId],

    );
    /*
    ==========================================
    UPDATE CALL HISTORY
    ==========================================
    */

    await pool.query(

      `
      UPDATE call_history
      SET
        status = 'accepted',
        started_at = CURRENT_TIMESTAMP
      WHERE call_id = $1;
      `,

      [callId],

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

    console.log(`✅ Call ${callId} answered`);

    res.status(200).json({

      success: true,

      message: "Call answered successfully.",

      call: result.rows[0],

      caller: caller.rows[0],

      receiver: receiver.rows[0],

    });

  } catch (error) {

    console.error("❌ Answer Call Error");
    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to answer call.",

      error: error.message,

    });

  }

};

module.exports = answerCall;