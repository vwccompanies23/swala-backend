const pool = require('../../config/db');

const deleteCommunity = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM communities
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Community not found"

      });

    }

    res.status(200).json({

      success: true,

      message: "Community deleted successfully"

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = deleteCommunity;