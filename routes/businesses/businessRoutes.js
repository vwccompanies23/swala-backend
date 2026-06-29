const express = require('express');

const router = express.Router();

const enableBusinessMode =
require('../../controllers/businesses/enableBusinessModeController');

const disableBusinessMode =
require('../../controllers/businesses/disableBusinessModeController');

const updateBusinessProfile =
require('../../controllers/businesses/updateBusinessProfileController');

const getBusinesses =
require('../../controllers/businesses/getBusinessesController');

const getBusinessProfile =
require('../../controllers/businesses/getBusinessProfileController');

router.put(
  '/enable',
  enableBusinessMode
);

router.put(
  '/disable',
  disableBusinessMode
);

router.put(
  '/update',
  updateBusinessProfile
);

router.get(
  '/',
  getBusinesses
);

router.get(
  '/:user_id',
  getBusinessProfile
);

module.exports = router;