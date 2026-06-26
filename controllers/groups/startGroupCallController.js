const pool = require('../../config/db');

const startGroupCall = async (
  req,
  res
) => {

  try {

    const {
      group_id,
      started_by,
      call_type
    } = req.body;

    const result =
    await pool.query(
      `
      INSERT INTO group_calls
      (
        group_id,
        started_by,
        call_type
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *
      `,
      [
        group_id,
        started_by,
        call_type
      ]
    );

    res.status(201).json({
      success: true,
      call: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports =
startGroupCall;