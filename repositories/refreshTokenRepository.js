const pool = require("../config/db");

class RefreshTokenRepository {

  async saveToken({

    userId,

    token,

    expiresAt,

    deviceId,

    deviceName,

    ipAddress,

  }) {

    await pool.query(

      `
      INSERT INTO refresh_tokens
      (

      user_id,

      token,

      expires_at,

      device_id,

      device_name,

      ip_address

      )

      VALUES

      ($1,$2,$3,$4,$5,$6)

      `,

      [

        userId,

        token,

        expiresAt,

        deviceId,

        deviceName,

        ipAddress,

      ],

    );

  }

}

module.exports = new RefreshTokenRepository();