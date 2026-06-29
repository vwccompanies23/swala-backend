const pool = require('../../config/db');

const getCommunity = async (req, res) => {

  try {

    const { id } = req.params;

    const result =
      await pool.query(
        `
        SELECT *
        FROM communities
        WHERE id = $1;
        `,
        [id]
      );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: 'Community not found'

      });

    }

    res.status(200).json({

      success: true,

      community: result.rows[0]

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = getCommunity;