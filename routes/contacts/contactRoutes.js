const express = require("express");

const router = express.Router();

const syncContacts =
require("../../controllers/contacts/syncContactsController");

router.post(
    "/sync",
    syncContacts,
);

module.exports = router;