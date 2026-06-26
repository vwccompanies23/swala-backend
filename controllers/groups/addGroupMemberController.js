const pool = require('../../config/db');

const addGroupMember = async (
  req,
  res
) => {

  try {

    const {
      group_id,
      user_id
    } = req.body;

    const existingMember =
    await pool.query(
      `
      SELECT *
      FROM group_members
      WHERE group_id = $1
      AND user_id = $2
      `,
      [
        group_id,
        user_id
      ]
    );

    if (
      existingMember.rows.length > 0
    ) {

      return res.status(400).json({
        success: false,
        error:
        'User already in group'
      });
    }

    const result =
    await pool.query(
      `
      INSERT INTO group_members
      (
        group_id,
        user_id
      )
      VALUES
      (
        $1,
        $2
      )
      RETURNING *
      `,
      [
        group_id,
        user_id
      ]
    );

    res.status(201).json({
      success: true,
      member:
      result.rows[0]
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
addGroupMember;