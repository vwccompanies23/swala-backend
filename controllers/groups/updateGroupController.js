const pool = require('../../config/db');

const updateGroup = async (
  req,
  res
) => {

  try {

    const {
      group_id,
      group_name,
      group_image,
      group_bio
    } = req.body;

    const result =
    await pool.query(
      `
      UPDATE groups
      SET
        group_name = $1,
        group_image = $2,
        group_bio = $3
      WHERE id = $4
      RETURNING *
      `,
      [
        group_name,
        group_image,
        group_bio,
        group_id
      ]
    );

    res.json({
      success: true,
      group: result.rows[0]
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
updateGroup;