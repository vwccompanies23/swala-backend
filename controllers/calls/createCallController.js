const pool = require('../../config/db');

const createCall = async (req, res) => {

  try {

    const {
      caller_id,
      receiver_id,
      call_type,
    } = req.body;

    // Validate required fields
    if (
      !caller_id ||
      !receiver_id ||
      !call_type
    ) {

      return res.status(400).json({

        success: false,

        message: 'Missing required fields.',

      });

    }

    // Prevent calling yourself
    if (caller_id === receiver_id) {

      return res.status(400).json({

        success: false,

        message: 'You cannot call yourself.',

      });

    }

    // Validate call type
    if (
      !['voice', 'video'].includes(call_type)
    ) {

      return res.status(400).json({

        success: false,

        message: 'Invalid call type.',

      });

    }

    const result = await pool.query(

      `
      INSERT INTO calls
      (
        caller_id,
        receiver_id,
        call_type,
        initiated_by
      )
      VALUES ($1,$2,$3,$1)
      RETURNING *;
      `,

      [
        caller_id,
        receiver_id,
        call_type,
      ],

    );

    res.status(201).json({

      success: true,

      message: 'Call created successfully.',

      call: result.rows[0],

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