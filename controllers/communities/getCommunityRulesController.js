const pool = require('../../config/db');

const getCommunityRules = async (req, res) => {

  try {

    const { community_id } = req.params;

    const result =
    await pool.query(
      `
      SELECT *
      FROM community_rules
      WHERE community_id = $1
      ORDER BY position ASC;
      `,
      [community_id]
    );

    res.status(200).json({

      success: true,

      rules: result.rows

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = getCommunityRules;