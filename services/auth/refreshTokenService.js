const pool = require("../../config/db");

class RefreshTokenService {

    async save({

        userId,

        token,

        expiresAt,

    }) {

        await pool.query(

            `
            INSERT INTO refresh_tokens
            (
                user_id,
                token,
                expires_at
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            `,

            [

                userId,

                token,

                expiresAt,

            ],

        );

    }

    async find(token) {

        const result = await pool.query(

            `
            SELECT *
            FROM refresh_tokens
            WHERE token = $1
            AND revoked = FALSE
            LIMIT 1
            `,

            [

                token,

            ],

        );

        return result.rows[0];

    }

    async revoke(token) {

        await pool.query(

            `
            UPDATE refresh_tokens
            SET revoked = TRUE
            WHERE token = $1
            `,

            [

                token,

            ],

        );

    }

    async revokeAll(userId) {

        await pool.query(

            `
            UPDATE refresh_tokens
            SET revoked = TRUE
            WHERE user_id = $1
            `,

            [

                userId,

            ],

        );

    }

}

module.exports = new RefreshTokenService();