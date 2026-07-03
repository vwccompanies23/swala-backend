const pool = require("../../config/db");

const uploadGroupProfile = async (req, res) => {

  try {

    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        error: "Group ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image uploaded",
      });
    }

    const imagePath = req.file.path;

    const result = await pool.query(
      `
      UPDATE groups
      SET group_image = $1
      WHERE id = $2
      RETURNING *
      `,
      [
        imagePath,
        groupId,
      ]
    );

    if (result.rows.length == 0) {
      return res.status(404).json({
        success: false,
        error: "Group not found",
      });
    }

    res.json({
      success: true,
      group: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

};

module.exports = uploadGroupProfile;