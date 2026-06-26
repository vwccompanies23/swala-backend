const express = require('express');

const router = express.Router();

const upload =
require('../../middleware/profileUpload');

const uploadProfileImage =
require('../../controllers/profile/uploadProfileImageController');

router.put(
  '/image',
  upload.single('profileImage'),
  uploadProfileImage,
);

module.exports = router;