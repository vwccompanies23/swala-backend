const pool = require('../../config/db');

const createCommunityRule = async (req, res) => {

  try {

    const {
      community_id,
      title,
      description,
      position
    } = req.body;

    const result =
    await pool.query(
      `
      INSERT INTO community_rules
      (
        community_id,
        title,
        description,
        position
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING *;
      `,
      [
        community_id,
        title,
        description,
        position
      ]
    );

    await pool.query(
      `
      UPDATE communities
      SET rules_count = rules_count + 1
      WHERE id = $1;
      `,
      [community_id]
    );

    res.status(201).json({

      success: true,

      rule: result.rows[0]

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = createCommunityRule;