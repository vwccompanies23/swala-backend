const passwordService =
require("./passwordService");

const {
    generateAccessToken,
    generateRefreshToken,
} = require("./generateTokens");

const refreshTokenService =
require("./refreshTokenService");

const sessionService =
require("./sessionService");

const { v4: uuid } =
require("uuid");

class AuthService {

    async createLogin({

        user,

        req,

    }) {

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);

        const device = req.device;

        const expiresAt = new Date();

        expiresAt.setDate(

            expiresAt.getDate() + 30,

        );

        await refreshTokenService.save({

            userId: user.id,

            token: refreshToken,

            expiresAt,

        });

        await sessionService.create({

            userId: user.id,

            sessionId: uuid(),

            refreshToken,

            deviceName:

                device.deviceName,

            deviceType:

                device.deviceType,

            platform:

                device.platform,

            appVersion:

                device.appVersion,

            ipAddress:

                device.ipAddress,

            userAgent:

                device.userAgent,

            expiresAt,

        });

        return {

            accessToken,

            refreshToken,

            user,

        };

    }

}

module.exports = new AuthService();