const verifyRefreshToken =
require("../../services/auth/verifyRefreshToken");

const refreshTokenService =
require("../../services/auth/refreshTokenService");

const {
    generateAccessToken,
} = require("../../services/auth/generateTokens");

const refreshToken = async (req, res) => {

    try {

        const {

            refreshToken,

        } = req.body;

        if (!refreshToken) {

            return res.status(401).json({

                success: false,

                error: "Refresh token required",

            });

        }

        const storedToken =

            await refreshTokenService.find(

                refreshToken,

            );

        if (!storedToken) {

            return res.status(403).json({

                success: false,

                error: "Invalid refresh token",

            });

        }

        const user =

            verifyRefreshToken(

                refreshToken,

            );

        if (!user) {

            return res.status(403).json({

                success: false,

                error: "Refresh token expired",

            });

        }

        const accessToken =

            generateAccessToken({

                id: user.id,

            });

        return res.json({

            success: true,

            accessToken,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error: error.message,

        });

    }

};

module.exports = refreshToken;