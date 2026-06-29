const pool = require('../../config/db');

const getSignals = async (req, res) => {

  try {

    const { callId } = req.params;

    const result = await pool.query(

      `
      SELECT
        *
      FROM call_signals
      WHERE
        call_id = $1
      ORDER BY created_at ASC;
      `,

      [callId],

    );

    res.status(200).json({

      success: true,

      total: result.rowCount,

      signals: result.rows,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: 'Failed to retrieve call signals.',

      error: error.message,

    });

  }

};

module.exports = getSignals;