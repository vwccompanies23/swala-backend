const jwt = require("jsonwebtoken");

function verifyRefreshToken(token) {

    try {

        return jwt.verify(

            token,

            process.env.REFRESH_TOKEN_SECRET,

        );

    } catch (error) {

        return null;

    }

}

module.exports = verifyRefreshToken;