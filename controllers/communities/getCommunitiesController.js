const pool = require('../../config/db');

const getCommunities = async (req, res) => {

  try {

    const result =
      await pool.query(
        `
        SELECT *
        FROM communities
        ORDER BY created_at DESC;
        `
      );

    res.status(200).json({

      success: true,

      communities: result.rows

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = getCommunities;