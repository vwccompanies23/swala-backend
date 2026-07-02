const express = require('express');

const router = express.Router();

const upload =
require('../../middleware/profileUpload');

const getProfile =
require('../../controllers/profile/getProfileController');

const updateProfile =
require('../../controllers/profile/updateProfileController');

const uploadProfileImage =
require('../../controllers/profile/uploadProfileImageController');

router.get(
  '/:id',
  getProfile,
);

router.put(
  '/update',
  updateProfile,
);

router.put(
  '/image',
  upload.single('profileImage'),
  uploadProfileImage,
);

module.exports = router;