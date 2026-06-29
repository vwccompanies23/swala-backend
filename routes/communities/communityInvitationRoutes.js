const express = require('express');

const router = express.Router();

const sendCommunityInvitation =
require('../../controllers/communities/sendCommunityInvitationController');

const respondCommunityInvitation =
require('../../controllers/communities/respondCommunityInvitationController');

const getJoinRequests =
require('../../controllers/communities/getJoinRequestsController');

router.post('/', sendCommunityInvitation);

router.put('/respond', respondCommunityInvitation);

router.get('/requests/:community_id', getJoinRequests);

module.exports = router;