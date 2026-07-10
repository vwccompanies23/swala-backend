const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFolder = path.join(
    __dirname,
    "../uploads/status"
);

if (!fs.existsSync(uploadFolder)) {

    fs.mkdirSync(uploadFolder, {

        recursive: true,

    });

}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadFolder);

    },

    filename(req, file, cb) {

        const extension =
            path.extname(file.originalname);

        cb(

            null,

            Date.now() +
            "-" +
            Math.round(Math.random() * 1000000000) +
            extension

        );

    },

});

const fileFilter = (req, file, cb) => {

    const allowed = [

        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",

        "video/mp4",
        "video/quicktime",
        "video/x-matroska",

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    }

    else {

        cb(

            new Error("Unsupported file type"),

            false,

        );

    }

};

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 100 * 1024 * 1024,

    },

});