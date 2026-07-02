const pool =
require("../../config/db");

class TokenCleanupService {

    async clean() {

        await pool.query(

            `
            DELETE
            FROM refresh_tokens
            WHERE expires_at < NOW()
            `,

        );

        await pool.query(

            `
            DELETE
            FROM user_sessions
            WHERE expires_at < NOW()
            `,

        );

        console.log(

            "🧹 Expired sessions cleaned.",

        );

    }

}

module.exports =
new TokenCleanupService();