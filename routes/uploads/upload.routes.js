const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        let folder = "uploads/files";

        if (file.mimetype.startsWith("image")) {
            folder = "uploads/images";
        }

        else if (file.mimetype.startsWith("audio")) {
            folder = "uploads/audio";
        }

        else if (file.mimetype.startsWith("video")) {
            folder = "uploads/videos";
        }

        cb(null, folder);
    },

    filename: function (req, file, cb) {

        const unique =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1000000);

        cb(
            null,
            unique + path.extname(file.originalname),
        );

    },

});

const upload = multer({
    storage,
});

router.post(

    "/",

    upload.single("file"),

    (req, res) => {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No file uploaded",

            });

        }

        res.json({

            success: true,

            fileName: req.file.filename,

            fileType: req.file.mimetype,

            filePath:
                "/" +
                req.file.path.replace(/\\/g, "/"),

        });

    },

);

module.exports = router;