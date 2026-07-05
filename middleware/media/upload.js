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

        const mime = file.mimetype;

        let folder = "uploads/documents";

        if (mime.startsWith("image/")) {

            folder = "uploads/images";

        }

        else if (mime.startsWith("video/")) {

            folder = "uploads/videos";

        }

        else if (

            mime.startsWith("audio/")

        ) {

            const original =

                file.originalname.toLowerCase();

            if (

                original.endsWith(".m4a") ||

                original.endsWith(".aac") ||

                original.endsWith(".opus")

            ) {

                folder = "uploads/voice";

            }

            else {

                folder = "uploads/audio";

            }

        }

        cb(

            null,

            folder,

        );

    },

    filename(req, file, cb) {

        const extension =

            path.extname(

                file.originalname,

            );

        cb(

            null,

            `${uuid()}${extension}`,

        );

    },

});

//////////////////////////////////////////////////////
// FILTER
//////////////////////////////////////////////////////

const allowed = [

    "image/",

    "video/",

    "audio/",

    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/zip",

    "application/x-zip-compressed",

    "text/plain",

];

function fileFilter(

    req,

    file,

    cb,

) {

    const ok = allowed.some(

        (type) =>

            file.mimetype.startsWith(type) ||

            file.mimetype === type,

    );

    if (!ok) {

        return cb(

            new Error(

                "Unsupported file type.",

            ),

        );

    }

    cb(

        null,

        true,

    );

}

//////////////////////////////////////////////////////
// EXPORT
//////////////////////////////////////////////////////

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize:

            1024 *

            1024 *

            500,

    },

});