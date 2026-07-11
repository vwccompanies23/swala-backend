const express = require("express");

const router = express.Router();

const upload =
require("../../middleware/uploadStatusMedia");

const createStatus =
require("../../controllers/status/createStatusController");

const getStatuses =
require("../../controllers/status/getStatusesController");

const uploadStatusMedia =
require("../../controllers/status/uploadStatusMediaController");

const viewStatus =
require("../../controllers/status/viewStatusController");

const getStatusViewers =
require("../../controllers/status/getStatusViewersController");

const deleteStatus =
require("../../controllers/status/deleteStatusController");

const deleteExpiredStatuses =
require("../../controllers/status/deleteExpiredStatusesController");

//////////////////////////////////////////////////////
// UPLOAD STATUS MEDIA
//////////////////////////////////////////////////////

router.post("/upload", (req, res, next) => {

    upload.single("media")(req, res, function (err) {

        if (err) {

            console.error("❌ Multer Error:");
            console.error(err);

            return res.status(500).json({
                success: false,
                error: err.message,
            });

        }

        next();

    });

}, uploadStatusMedia);

//////////////////////////////////////////////////////
// CREATE STATUS
//////////////////////////////////////////////////////

router.post(

    "/create",

    createStatus,

);

//////////////////////////////////////////////////////
// GET STATUSES
//////////////////////////////////////////////////////

router.get(

    "/",

    getStatuses,

);

//////////////////////////////////////////////////////
// VIEW STATUS
//////////////////////////////////////////////////////

router.post(

    "/view",

    viewStatus,

);

//////////////////////////////////////////////////////
// GET STATUS VIEWERS
//////////////////////////////////////////////////////

router.get(

    "/viewers/:statusId",

    getStatusViewers,

);

//////////////////////////////////////////////////////
// DELETE STATUS
//////////////////////////////////////////////////////

router.delete(

    "/delete/:statusId",

    deleteStatus,

);

//////////////////////////////////////////////////////
// DELETE EXPIRED STATUSES
// (Scheduler can call this internally.
// This endpoint is also useful for testing.)
//////////////////////////////////////////////////////

router.delete(

    "/cleanup",

    deleteExpiredStatuses,

);

module.exports = router;