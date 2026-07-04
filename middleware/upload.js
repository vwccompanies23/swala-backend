const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFolder = "uploads";

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadFolder);

    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    },

});

const fileFilter = (req, file, cb) => {

    cb(null, true);

};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 1024 * 1024 * 300,

    },

});

module.exports = upload;