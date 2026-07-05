const express = require("express");

const router = express.Router();

const upload =
require("../../middleware/media/upload");

const uploadImageController =
require("../../controllers/media/uploadImageController");

const uploadVideoController =
require("../../controllers/media/uploadVideoController");

const uploadVoiceController =
require("../../controllers/media/uploadVoiceController");

const uploadAudioController =
require("../../controllers/media/uploadAudioController");

const uploadDocumentController =
require("../../controllers/media/uploadDocumentController");

const createMediaMessageController =
require("../../controllers/media/createMediaMessageController");

//////////////////////////////////////////////////////
// UPLOAD IMAGE
//////////////////////////////////////////////////////

router.post(

    "/upload/image",

    upload.single("file"),

    uploadImageController,

);

//////////////////////////////////////////////////////
// UPLOAD VIDEO
//////////////////////////////////////////////////////

router.post(

    "/upload/video",

    upload.single("file"),

    uploadVideoController,

);

//////////////////////////////////////////////////////
// UPLOAD VOICE
//////////////////////////////////////////////////////

router.post(

    "/upload/voice",

    upload.single("file"),

    uploadVoiceController,

);

//////////////////////////////////////////////////////
// UPLOAD AUDIO
//////////////////////////////////////////////////////

router.post(

    "/upload/audio",

    upload.single("file"),

    uploadAudioController,

);

//////////////////////////////////////////////////////
// UPLOAD DOCUMENT
//////////////////////////////////////////////////////

router.post(

    "/upload/document",

    upload.single("file"),

    uploadDocumentController,

);

//////////////////////////////////////////////////////
// CREATE MEDIA MESSAGE
//////////////////////////////////////////////////////

router.post(

    "/message",

    upload.single("file"),

    createMediaMessageController,

);

module.exports = router;