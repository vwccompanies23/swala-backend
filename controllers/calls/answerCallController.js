const pool = require('../../config/db');

const answerCall = async (req, res) => {

  try {

    const { callId } = req.params;

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

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: 'Call not found.',

      });

    }

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

      WHERE id = $1
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

      WHERE id = $1
      `,

      [result.rows[0].receiver_id],

    );

    /*
    ==========================================
    RESPONSE
    ==========================================
    */

    res.status(200).json({

      success: true,

      message: 'Call answered successfully.',

      call: result.rows[0],

      caller: caller.rows[0],

      receiver: receiver.rows[0],

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: 'Failed to answer call.',

      error: error.message,

    });

  }

};

module.exports = answerCall;