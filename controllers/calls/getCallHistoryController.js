const pool = require('../../config/db');

const getCallHistory = async (req, res) => {

  try {

    const { userId } = req.params;

    const result = await pool.query(

      `
      SELECT

        c.*,

        caller.full_name AS caller_name,
        caller.username AS caller_username,
        caller.profile_image AS caller_photo,

        receiver.full_name AS receiver_name,
        receiver.username AS receiver_username,
        receiver.profile_image AS receiver_photo

      FROM calls c

      LEFT JOIN users caller
      ON c.caller_id = caller.id

      LEFT JOIN users receiver
      ON c.receiver_id = receiver.id

      WHERE

        c.caller_id = $1

        OR

        c.receiver_id = $1

      ORDER BY c.created_at DESC
      `,

      [userId],

    );

    res.status(200).json({

      success: true,

      calls: result.rows,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: 'Failed to load call history.',

      error: error.message,

    });

  }

};

module.exports = getCallHistory;