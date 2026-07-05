const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

//////////////////////////////////////////////////////
// CREATE FOLDERS
//////////////////////////////////////////////////////

const folders = [
    "uploads/images",
    "uploads/videos",
    "uploads/voice",
    "uploads/audio",
    "uploads/documents",
];

for (const folder of folders) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {
            recursive: true,
        });
    }
}

//////////////////////////////////////////////////////
// STORAGE
//////////////////////////////////////////////////////

const storage = multer.diskStorage({

    destination(req, file, cb) {

        const mime = (file.mimetype || "").toLowerCase();

        let folder = "uploads/documents";

        if (
            mime.startsWith("image/")
        ) {

            folder = "uploads/images";

        } else if (
            mime.startsWith("video/")
        ) {

            folder = "uploads/videos";

        } else if (
            mime.startsWith("audio/")
        ) {

            const name =
                file.originalname.toLowerCase();

            if (
                name.endsWith(".opus") ||
                name.endsWith(".aac") ||
                name.endsWith(".m4a") ||
                name.endsWith(".amr")
            ) {

                folder = "uploads/voice";

            } else {

                folder = "uploads/audio";

            }

        }

        cb(null, folder);

    },

    filename(req, file, cb) {

        cb(

            null,

            `${uuid()}${path.extname(file.originalname)}`,

        );

    },

});

//////////////////////////////////////////////////////
// FILTER
//////////////////////////////////////////////////////

function fileFilter(req, file, cb) {

    console.log("========== UPLOAD ==========");
    console.log("Original:", file.originalname);
    console.log("Mime:", file.mimetype);
    console.log("============================");

    const mime =
        (file.mimetype || "").toLowerCase();

    const allowed =

        mime.startsWith("image/") ||

        mime.startsWith("video/") ||

        mime.startsWith("audio/") ||

        mime === "application/pdf" ||

        mime === "application/msword" ||

        mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||

        mime === "application/vnd.ms-excel" ||

        mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||

        mime === "application/vnd.ms-powerpoint" ||

        mime === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||

        mime === "application/zip" ||

        mime === "application/x-zip-compressed" ||

        mime === "text/plain" ||

        mime === "application/octet-stream";

    if (!allowed) {

        console.log("Rejected MIME:", mime);

        return cb(
            new Error("Unsupported file type.")
        );

    }

    cb(null, true);

}

//////////////////////////////////////////////////////
// EXPORT
//////////////////////////////////////////////////////

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 500 * 1024 * 1024,

    },

});