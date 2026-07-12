const express = require("express");

const router = express.Router();

const createShareController =
require("../../controllers/shares/createShareController");

const getSharesController =
require("../../controllers/shares/getSharesController");

const deleteShareController =
require("../../controllers/shares/deleteShareController");

//////////////////////////////////////////////////////
// CREATE SHARE
//////////////////////////////////////////////////////

router.post(

    "/create",

    createShareController,

);

//////////////////////////////////////////////////////
// GET SHARES
//////////////////////////////////////////////////////

router.get(

    "/:post_id",

    getSharesController,

);

//////////////////////////////////////////////////////
// DELETE SHARE
//////////////////////////////////////////////////////

router.delete(

    "/:shareId",

    deleteShareController,

);

module.exports = router;