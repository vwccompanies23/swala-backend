const pool = require('../../config/db');

const createCall = async (req, res) => {

  try {

    const {
      caller_id,
      receiver_id,
      call_type,
      is_group_call = false,
      group_id = null,
    } = req.body;

    /*
    ==========================================
    VALIDATION
    ==========================================
    */

    if (!caller_id || !call_type) {

      return res.status(400).json({

        success: false,

        message: 'Missing required fields.',

      });

    }

    if (!is_group_call && !receiver_id) {

      return res.status(400).json({

        success: false,

        message: 'Receiver is required.',

      });

    }

    if (
      !['voice', 'video'].includes(call_type)
    ) {

      return res.status(400).json({

        success: false,

        message: 'Invalid call type.',

      });

    }

    if (
      !is_group_call &&
      caller_id === receiver_id
    ) {

      return res.status(400).json({

        success: false,

        message: 'You cannot call yourself.',

      });

    }

    /*
    ==========================================
    CREATE CALL
    ==========================================
    */

    const result = await pool.query(

      `
      INSERT INTO calls
      (
        caller_id,
        receiver_id,
        call_type,
        initiated_by
      )
      VALUES
      ($1,$2,$3,$1)
      RETURNING *;
      `,

      [
        caller_id,
        receiver_id,
        call_type,
      ],

    );

    /*
    ==========================================
    GET CALLER
    ==========================================
    */

    const callerResult = await pool.query(

      `
      SELECT

        id,

        full_name,

        username,

        profile_image

      FROM users

      WHERE id = $1
      `,

      [caller_id],

    );

    /*
    ==========================================
    GET RECEIVER
    ==========================================
    */

    let receiverResult = {

      rows: [],

    };

    if (!is_group_call) {

      receiverResult = await pool.query(

        `
        SELECT

          id,

          full_name,

          username,

          profile_image

        FROM users

        WHERE id = $1
        `,

        [receiver_id],

      );

    }

    /*
    ==========================================
    RESPONSE
    ==========================================
    */

    res.status(201).json({

      success: true,

      message: 'Call created successfully.',

      call: result.rows[0],

      caller: callerResult.rows[0],

      receiver: receiverResult.rows[0] ?? null,

      isGroupCall: is_group_call,

      groupId: group_id,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: 'Failed to create call.',

      error: error.message,

    });

  }

};

module.exports = createCall;