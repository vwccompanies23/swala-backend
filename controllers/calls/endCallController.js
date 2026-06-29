const pool = require('../../config/db');

const endCall = async (req, res) => {

  try {

    const { callId } = req.params;
    const { ended_by } = req.body;

    const result = await pool.query(

      `
      UPDATE calls
      SET
        status = 'ended',
        ended_at = CURRENT_TIMESTAMP,
        ended_by = $2,
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
        ended_by,
      ],

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: 'Call not found.',

      });

    }

    await pool.query(

      `
      INSERT INTO call_history
      (
        call_id,
        caller_id,
        receiver_id,
        call_type,
        status,
        duration,
        initiated_by,
        ended_by,
        started_at,
        ended_at
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
      );
      `,

      [

        result.rows[0].id,
        result.rows[0].caller_id,
        result.rows[0].receiver_id,
        result.rows[0].call_type,
        result.rows[0].status,
        result.rows[0].duration,
        result.rows[0].initiated_by,
        result.rows[0].ended_by,
        result.rows[0].started_at,
        result.rows[0].ended_at,

      ],

    );

    res.status(200).json({

      success: true,

      message: 'Call ended successfully.',

      call: result.rows[0],

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: 'Failed to end call.',

      error: error.message,

    });

  }

};

module.exports = endCall;