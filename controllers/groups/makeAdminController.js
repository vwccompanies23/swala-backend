const pool = require('../../config/db');

const makeAdmin = async (
  req,
  res
) => {

  try {

    const {
      group_id,
      user_id
    } = req.body;

    await pool.query(
      `
      UPDATE group_members
      SET is_admin = TRUE
      WHERE group_id = $1
      AND user_id = $2
      `,
      [
        group_id,
        user_id
      ]
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
makeAdmin;