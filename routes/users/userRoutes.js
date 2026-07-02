const express = require('express');

const router = express.Router();

const searchUsers =
require('../../controllers/searchs/searchUsersController');

const getUser =
require('../../controllers/users/getUserController');

const getAllUsers =
require('../../controllers/users/getAllUsersController');

const getAvailableUsers =
require('../../controllers/users/getAvailableUsersController');

const saveFcmToken =
require('../../controllers/users/saveFcmTokenController');

// Get all users
router.get(
  '/',
  getAllUsers,
);

// Search users
router.get(
  '/search',
  searchUsers,
);

// Get available users (excluding current user)
router.get(
  '/list/:userId',
  getAvailableUsers,
);

// Save FCM token
router.post(
  '/save-fcm-token',
  saveFcmToken,
);

// Get one user
router.get(
  '/:id',
  getUser,
);

module.exports = router;