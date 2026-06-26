const express = require('express');

const router = express.Router();

const searchUsers =
require('../../controllers/searchs/searchUsersController');

const getUser =
require('../../controllers/users/getUserController');
const getAllUsers =
require('../../controllers/users/getAllUsersController');
const saveFcmToken =
require('../../controllers/users/saveFcmTokenController');

router.get('/', getAllUsers);

router.get('/search', searchUsers);

router.post(
  '/save-fcm-token',
  saveFcmToken,
);

router.get('/:id', getUser);

module.exports = router;