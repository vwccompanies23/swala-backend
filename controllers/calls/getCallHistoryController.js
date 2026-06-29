const pool = require('../../config/db');

const getCallHistory = async (req, res) => {

  try {

    const { userId } = req.params;

    const result = await pool.query(

      `
      SELECT
        *
      FROM call_history
      WHERE
        caller_id = $1
        OR receiver_id = $1
      ORDER BY created_at DESC;
      `,

      [userId],

    );

    res.status(200).json({

      success: true,

      total: result.rowCount,

      calls: result.rows,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: 'Failed to retrieve call history.',

      error: error.message,

    });

  }

};

module.exports = getCallHistory;