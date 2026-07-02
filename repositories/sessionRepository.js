const pool = require("../config/db");

class SessionRepository {

    async create(session) {

        const result = await pool.query(

            `
            INSERT INTO user_sessions
            (
                user_id,
                session_id,
                refresh_token,
                device_name,
                device_type,
                platform,
                app_version,
                ip_address,
                user_agent,
                expires_at
            )

            VALUES

            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)

            RETURNING *
            `,

            [

                session.userId,

                session.sessionId,

                session.refreshToken,

                session.deviceName,

                session.deviceType,

                session.platform,

                session.appVersion,

                session.ipAddress,

                session.userAgent,

                session.expiresAt,

            ],

        );

        return result.rows[0];

    }

}

module.exports = new SessionRepository();