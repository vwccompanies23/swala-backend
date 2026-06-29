const express = require('express');

const router = express.Router();

const joinCommunity =
require('../../controllers/communities/joinCommunityController');

const leaveCommunity =
require('../../controllers/communities/leaveCommunityController');

const getCommunityMembers =
require('../../controllers/communities/getCommunityMembersController');

const updateMemberRole =
require('../../controllers/communities/updateMemberRoleController');

router.post('/join', joinCommunity);

router.delete('/leave', leaveCommunity);

router.get('/:community_id', getCommunityMembers);

router.put('/role', updateMemberRole);

module.exports = router;