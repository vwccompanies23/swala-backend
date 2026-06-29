const pool = require('../../config/db');

const sendSignal = async (req, res) => {

  try {

    const { callId } = req.params;

    const {
      sender_id,
      receiver_id,
      signal_type,
      signal_data,
    } = req.body;

    if (
      !sender_id ||
      !receiver_id ||
      !signal_type ||
      !signal_data
    ) {

      return res.status(400).json({

        success: false,

        message: 'Missing required fields.',

      });

    }

    if (
      ![
        'offer',
        'answer',
        'ice-candidate',
        'renegotiate',
        'bye',
      ].includes(signal_type)
    ) {

      return res.status(400).json({

        success: false,

        message: 'Invalid signal type.',

      });

    }

    const result = await pool.query(

      `
      INSERT INTO call_signals
      (
        call_id,
        sender_id,
        receiver_id,
        signal_type,
        signal_data
      )
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
      `,

      [

        callId,
        sender_id,
        receiver_id,
        signal_type,
        signal_data,

      ],

    );

    res.status(201).json({

      success: true,

      message: 'Signal sent successfully.',

      signal: result.rows[0],

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: 'Failed to send signal.',

      error: error.message,

    });

  }

};

module.exports = sendSignal;