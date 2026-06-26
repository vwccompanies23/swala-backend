const pool = require('../../config/db');

const endGroupCall = async (
  req,
  res
) => {

  try {

    const {
      call_id
    } = req.body;

    await pool.query(
      `
      UPDATE group_calls
      SET
        is_active = FALSE,
        ended_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [call_id]
    );

    res.json({
      success: true
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
endGroupCall;