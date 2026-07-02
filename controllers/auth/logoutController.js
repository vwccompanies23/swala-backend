const refreshTokenService =
require("../../services/auth/refreshTokenService");

const logout = async (req, res) => {

    try {

        const {

            refreshToken,

        } = req.body;

        if (!refreshToken) {

            return res.status(400).json({

                success: false,

                error: "Refresh token is required",

            });

        }

        await refreshTokenService.revoke(

            refreshToken,

        );

        return res.json({

            success: true,

            message: "Logged out successfully",

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

module.exports = logout;