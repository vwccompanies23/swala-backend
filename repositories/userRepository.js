const pool = require("../config/db");

class UserRepository {

  async findByPhone(phone) {

    const result = await pool.query(

      "SELECT * FROM users WHERE phone = $1",

      [phone],

    );

    return result.rows[0];

  }

  async findById(id) {

    const result = await pool.query(

      "SELECT * FROM users WHERE id = $1",

      [id],

    );

    return result.rows[0];

  }

  async updateProfileImage(id, image) {

    const result = await pool.query(

      `
      UPDATE users
      SET profile_image = $1
      WHERE id = $2
      RETURNING *
      `,

      [

        image,

        id,

      ],

    );

    return result.rows[0];

  }

}

module.exports = new UserRepository();