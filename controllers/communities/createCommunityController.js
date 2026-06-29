const pool = require('../../config/db');

const createCommunity = async (req, res) => {

  try {

    const {
      owner_id,
      name,
      username,
      description,
      profile_image,
      cover_image,
      category,
      is_private
    } = req.body;

    const communityResult =
      await pool.query(
        `
        INSERT INTO communities
        (
          owner_id,
          name,
          username,
          description,
          profile_image,
          cover_image,
          category,
          is_private
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8
        )
        RETURNING *;
        `,
        [
          owner_id,
          name,
          username,
          description,
          profile_image,
          cover_image,
          category,
          is_private
        ]
      );

    const community =
      communityResult.rows[0];

    await pool.query(
      `
      INSERT INTO community_members
      (
        community_id,
        user_id,
        role,
        status
      )
      VALUES
      (
        $1,
        $2,
        'owner',
        'active'
      );
      `,
      [
        community.id,
        owner_id
      ]
    );

    await pool.query(
      `
      UPDATE communities
      SET members_count = 1
      WHERE id = $1;
      `,
      [community.id]
    );

    res.status(201).json({

      success: true,

      community

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};

module.exports = createCommunity;