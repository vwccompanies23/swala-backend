const pool = require('../../config/db');

const createGroup = async (req, res) => {

  try {

    const {
      group_name,
      group_image,
      created_by
    } = req.body;

    const groupResult =
    await pool.query(
      `
      INSERT INTO groups
      (
        group_name,
        group_image,
        created_by
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *;
      `,
      [
        group_name,
        group_image,
        created_by
      ]
    );

    const group =
    groupResult.rows[0];

    await pool.query(
      `
      INSERT INTO group_members
      (
        group_id,
        user_id,
        is_admin
      )
      VALUES
      (
        $1,
        $2,
        TRUE
      )
      `,
      [
        group.id,
        created_by
      ]
    );

    res.status(201).json({
      success: true,
      group
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = createGroup;