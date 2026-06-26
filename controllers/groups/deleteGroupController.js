const pool = require('../../config/db');

const deleteGroup = async (
  req,
  res
) => {

  try {

    const {
      group_id
    } = req.params;

    await pool.query(
      `
      DELETE FROM group_messages
      WHERE group_id = $1
      `,
      [group_id]
    );

    await pool.query(
      `
      DELETE FROM group_members
      WHERE group_id = $1
      `,
      [group_id]
    );

    await pool.query(
      `
      DELETE FROM groups
      WHERE id = $1
      `,
      [group_id]
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
deleteGroup;