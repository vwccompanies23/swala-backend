const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFolder = path.join(
    __dirname,
    "../uploads/posts"
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

    console.log("Uploaded File:", file.originalname);
    console.log("MIME:", file.mimetype);

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    const allowedMimeTypes = [

        // Images
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/bmp",
        "image/tiff",
        "image/heic",
        "image/heif",
        "image/avif",
        "image/svg+xml",

        // Android sometimes sends this
        "application/octet-stream",

        // Videos
        "video/mp4",
        "video/quicktime",
        "video/webm",
        "video/x-matroska",
        "video/3gpp",
        "video/3gpp2",
        "video/mpeg",
        "video/x-msvideo",
        "video/ogg",

    ];

    const allowedExtensions = [

        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".bmp",
        ".tiff",
        ".heic",
        ".heif",
        ".avif",
        ".svg",

        ".mp4",
        ".mov",
        ".mkv",
        ".3gp",
        ".3g2",
        ".mpeg",
        ".avi",
        ".webm",

    ];

    if (
        allowedMimeTypes.includes(file.mimetype) ||
        allowedExtensions.includes(extension)
    ) {

        return cb(null, true);

    }

    return cb(
        new Error(
            `Unsupported file type: ${file.mimetype}`
        ),
        false,
    );

};

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 250 * 1024 * 1024,

    },

});