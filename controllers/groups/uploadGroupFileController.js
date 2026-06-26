const pool = require('../../config/db');

const uploadGroupFile = async (
  req,
  res
) => {

  try {

    const {
      group_id,
      sender_id,
      file_name,
      file_url,
      file_type
    } = req.body;

    const result =
    await pool.query(
      `
      INSERT INTO group_files
      (
        group_id,
        sender_id,
        file_name,
        file_url,
        file_type
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING *
      `,
      [
        group_id,
        sender_id,
        file_name,
        file_url,
        file_type
      ]
    );

    res.status(201).json({
      success: true,
      file: result.rows[0]
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
uploadGroupFile;