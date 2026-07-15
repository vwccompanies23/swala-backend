const express = require("express");

const router = express.Router();

const syncContacts =
require("../../controllers/contacts/syncContactsController");

const getSecretContacts =
require("../../controllers/contacts/getSecretContacts");

router.post(
    "/sync",
    syncContacts,
);

router.get(
    "/secret/:userId",
    getSecretContacts,
);

module.exports = router;