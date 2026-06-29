const pool = require('../../../config/db');

const getCommunityFiles = async (req, res) => {

  try {

    const { post_id } = req.params;

    const result =
    await pool.query(
      `
      SELECT *
      FROM community_files
      WHERE post_id = $1
      ORDER BY created_at ASC;
      `,
      [post_id]
    );

    res.status(200).json({

      success: true,

      files: result.rows

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = getCommunityFiles;