const pool = require('../../config/db');

const removeGroupMember = async (
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
      DELETE FROM group_members
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
removeGroupMember;