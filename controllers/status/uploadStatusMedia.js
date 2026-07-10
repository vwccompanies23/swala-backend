const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(

    __dirname,

    "../uploads/status"

);

if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(uploadDir, {

        recursive: true,

    });

}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadDir);

    },

    filename(req, file, cb) {

        const ext = path.extname(file.originalname);

        cb(

            null,

            Date.now() + "-" + Math.round(Math.random() * 1E9) + ext

        );

    },

});

const fileFilter = (req, file, cb) => {

    const allowed = [

        "image/jpeg",

        "image/png",

        "image/webp",

        "video/mp4",

        "video/quicktime",

        "video/x-matroska",

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(

            new Error("Unsupported media type"),

            false

        );

    }

};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 100 * 1024 * 1024,

    },

});

module.exports = upload;