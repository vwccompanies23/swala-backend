const express = require('express');

const router = express.Router();

const toggleLike =
require('../../controllers/likes/toggleLikeController');

router.post('/toggle', toggleLike);

module.exports = router;