const express = require('express');

const router = express.Router();

const getTrending =
require('../../controllers/trending/getTrendingController');

router.get(
  '/',
  getTrending
);

module.exports = router;