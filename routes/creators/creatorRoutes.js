const express = require('express');

const router = express.Router();

const enableCreatorMode =
require('../../controllers/creators/enableCreatorModeController');

const disableCreatorMode =
require('../../controllers/creators/disableCreatorModeController');

const updateCreatorProfile =
require('../../controllers/creators/updateCreatorProfileController');

const getCreators =
require('../../controllers/creators/getCreatorsController');

const getCreatorProfile =
require('../../controllers/creators/getCreatorProfileController');

/*
|--------------------------------------------------------------------------
| Creator Mode
|--------------------------------------------------------------------------
*/

router.put(
  '/enable',
  enableCreatorMode
);

router.put(
  '/disable',
  disableCreatorMode
);

router.put(
  '/update',
  updateCreatorProfile
);

router.get(
  '/',
  getCreators
);

router.get(
  '/:user_id',
  getCreatorProfile
);

module.exports = router;