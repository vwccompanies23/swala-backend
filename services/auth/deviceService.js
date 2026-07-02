class DeviceService {

    getDevice(req) {

        return {

            deviceName:

                req.headers["x-device-name"] ||

                "Unknown Device",

            deviceType:

                req.headers["x-device-type"] ||

                "Unknown",

            platform:

                req.headers["x-platform"] ||

                "Unknown",

            appVersion:

                req.headers["x-app-version"] ||

                "1.0.0",

            ipAddress:

                req.ip ||

                req.connection.remoteAddress ||

                "",

            userAgent:

                req.headers["user-agent"] ||

                "",

        };

    }

}

module.exports = new DeviceService();