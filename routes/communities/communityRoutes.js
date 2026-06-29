const express = require('express');

const router = express.Router();

const createCommunity =
require('../../controllers/communities/createCommunityController');

const getCommunities =
require('../../controllers/communities/getCommunitiesController');

const getCommunity =
require('../../controllers/communities/getCommunityController');

const updateCommunity =
require('../../controllers/communities/updateCommunityController');

const deleteCommunity =
require('../../controllers/communities/deleteCommunityController');

// Communities
router.post('/', createCommunity);

router.get('/', getCommunities);

// Single Community
router.get('/:id', getCommunity);

router.put('/:id', updateCommunity);

router.delete('/:id', deleteCommunity);

module.exports = router;