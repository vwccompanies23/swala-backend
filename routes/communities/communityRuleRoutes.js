const express = require('express');

const router = express.Router();

const createCommunityRule =
require('../../controllers/communities/createCommunityRuleController');

const getCommunityRules =
require('../../controllers/communities/getCommunityRulesController');

router.post('/', createCommunityRule);

router.get('/:community_id', getCommunityRules);

module.exports = router;