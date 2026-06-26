const express = require('express');
const router = express.Router();

const registerUser =
require('../../controllers/registers/registerController');

const loginUser =
require('../../controllers/logins/loginController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;