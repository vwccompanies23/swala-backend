const pool = require('../../../config/db');

const uploadCommunityFile = async (req, res) => {

  try {

    const {
      post_id,
      uploaded_by,
      file_name,
      file_url,
      file_type,
      file_size
    } = req.body;

    const result =
    await pool.query(
      `
      INSERT INTO community_files
      (
        post_id,
        uploaded_by,
        file_name,
        file_url,
        file_type,
        file_size
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *;
      `,
      [
        post_id,
        uploaded_by,
        file_name,
        file_url,
        file_type,
        file_size
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

module.exports = uploadCommunityFile;