const pool = require('../../../config/db');

const deleteChannelFile = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required.',
      });
    }

    const result = await pool.query(
      `
      DELETE FROM channel_files
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'File deleted successfully.',
      file: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete file.',
      error: error.message,
    });

  }
};

module.exports = deleteChannelFile;