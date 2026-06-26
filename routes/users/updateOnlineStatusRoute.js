const express = require('express');

const router = express.Router();

const updateOnlineStatus =
require('../../controllers/users/updateOnlineStatusController');

router.put(
  '/online-status',
  updateOnlineStatus,
);

module.exports = router;