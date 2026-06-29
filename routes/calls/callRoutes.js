const express = require('express');

const router = express.Router();

const createCall =
require('../../controllers/calls/createCallController');

const answerCall =
require('../../controllers/calls/answerCallController');

const rejectCall =
require('../../controllers/calls/rejectCallController');

const endCall =
require('../../controllers/calls/endCallController');

const getCallHistory =
require('../../controllers/calls/getCallHistoryController');

const sendSignal =
require('../../controllers/calls/sendSignalController');

const getSignals =
require('../../controllers/calls/getSignalsController');

/*
==================================
CALL MANAGEMENT
==================================
*/

router.post(
  '/',
  createCall,
);

router.put(
  '/:callId/answer',
  answerCall,
);

router.put(
  '/:callId/reject',
  rejectCall,
);

router.put(
  '/:callId/end',
  endCall,
);

/*
==================================
WEBRTC SIGNALING
==================================
*/

router.post(
  '/:callId/signal',
  sendSignal,
);

router.get(
  '/:callId/signals',
  getSignals,
);

/*
==================================
CALL HISTORY
==================================
*/

router.get(
  '/history/:userId',
  getCallHistory,
);

module.exports = router;