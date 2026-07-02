const jwt = require("jsonwebtoken");

function verifyAccessToken(token) {

    try {

        return jwt.verify(

            token,

            process.env.JWT_SECRET,

        );

    } catch (error) {

        return null;

    }

}

module.exports = verifyAccessToken;