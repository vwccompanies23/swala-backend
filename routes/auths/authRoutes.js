const express = require("express");

const router = express.Router();

const loginController =
require("../../controllers/auth/loginController");

const registerController =
require("../../controllers/auth/registerController");

const refreshTokenController =
require("../../controllers/auth/refreshTokenController");

const logoutController =
require("../../controllers/auth/logoutController");

const authenticateToken =
require("../../middleware/authenticateToken");

const meController =
require("../../controllers/auth/meController");

router.get(
    "/me",
    authenticateToken,
    meController,
);

router.post(
    "/login",
    loginController,
);

router.post(
    "/register",
    registerController,
);

router.post(
    "/refresh",
    refreshTokenController,
);

router.post(
    "/logout",
    logoutController,
);

module.exports = router;