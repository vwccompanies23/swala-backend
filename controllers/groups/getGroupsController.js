const pool = require('../../config/db');

const getGroups = async (req, res) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM groups
      ORDER BY created_at DESC
      `
    );

    res.json({
      success: true,
      groups: result.rows
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
getGroups;