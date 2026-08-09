const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

//////////////////////////////////////////////////////
// ACCESS TOKEN
//////////////////////////////////////////////////////

function generateAccessToken(user) {

    return jwt.sign(

        {
            id: user.id,
            username: user.username,
            phone: user.phone,
        },

        process.env.JWT_SECRET,

        {
            expiresIn: process.env.JWT_EXPIRES,
        },

    );

}

//////////////////////////////////////////////////////
// REFRESH TOKEN
//////////////////////////////////////////////////////

function generateRefreshToken(user) {

    return jwt.sign(

        {
            id: user.id,

            // Makes every refresh token unique
            jti: uuid(),

        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
        },

    );

}

module.exports = {

    generateAccessToken,
    generateRefreshToken,

};