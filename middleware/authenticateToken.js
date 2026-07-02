const verifyAccessToken =
require("../services/auth/verifyAccessToken");

module.exports = (req, res, next) => {

    try {

        const authHeader =

            req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                error: "Access token missing",

            });

        }

        const token =

            authHeader.split(" ")[1];

        if (!token) {

            return res.status(401).json({

                success: false,

                error: "Invalid authorization header",

            });

        }

        const user =

            verifyAccessToken(token);

        if (!user) {

            return res.status(403).json({

                success: false,

                error: "Invalid or expired token",

            });

        }

        req.user = user;

        next();

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            error: error.message,

        });

    }

};