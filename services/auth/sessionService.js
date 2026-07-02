const pool = require("../../config/db");

class SessionService {

    async create({

        userId,

        sessionId,

        refreshToken,

        deviceName,

        deviceType,

        platform,

        appVersion,

        ipAddress,

        userAgent,

        expiresAt,

    }) {

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
            (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
            )
            RETURNING *
            `,

            [

                userId,

                sessionId,

                refreshToken,

                deviceName,

                deviceType,

                platform,

                appVersion,

                ipAddress,

                userAgent,

                expiresAt,

            ],

        );

        return result.rows[0];

    }

    async deactivate(sessionId) {

        await pool.query(

            `
            UPDATE user_sessions
            SET is_active = FALSE
            WHERE session_id = $1
            `,

            [

                sessionId,

            ],

        );

    }

    async touch(sessionId) {

        await pool.query(

            `
            UPDATE user_sessions
            SET last_seen = NOW()
            WHERE session_id = $1
            `,

            [

                sessionId,

            ],

        );

    }

}

module.exports = new SessionService();