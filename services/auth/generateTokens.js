const jwt = require('jsonwebtoken');

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
        }
    );

}

function generateRefreshToken(user) {

    return jwt.sign(
        {
            id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
        }
    );

}

module.exports = {

    generateAccessToken,
    generateRefreshToken,

};