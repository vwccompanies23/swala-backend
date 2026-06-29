const pool = require('../../../config/db');

const uploadChannelFile = async (req, res) => {
  try {

    const {
      post_id,
      uploaded_by,
      file_name,
      file_url,
      file_type,
      file_size
    } = req.body;

    if (
      !post_id ||
      !uploaded_by ||
      !file_name ||
      !file_url ||
      !file_type
    ) {
      return res.status(400).json({
        success: false,
        message: 'post_id, uploaded_by, file_name, file_url and file_type are required.',
      });
    }

    const postExists = await pool.query(
      `
      SELECT id
      FROM channel_posts
      WHERE id = $1;
      `,
      [post_id]
    );

    if (postExists.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Channel post not found.',
      });
    }

    const result = await pool.query(
      `
      INSERT INTO channel_files
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
      message: 'File uploaded successfully.',
      file: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to upload file.',
      error: error.message,
    });

  }
};

module.exports = uploadChannelFile;