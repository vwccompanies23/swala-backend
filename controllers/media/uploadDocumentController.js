const path = require("path");

const uploadDocumentController = async (req, res) => {

    try {

        //////////////////////////////////////////////////////
        // FILE REQUIRED
        //////////////////////////////////////////////////////

        if (!req.file) {

            return res.status(400).json({

                success: false,

                error: "No document uploaded.",

            });

        }

        //////////////////////////////////////////////////////
        // ALLOWED DOCUMENT TYPES
        //////////////////////////////////////////////////////

        const allowed = [

            "application/pdf",

            "application/msword",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            "application/vnd.ms-excel",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

            "application/vnd.ms-powerpoint",

            "application/vnd.openxmlformats-officedocument.presentationml.presentation",

            "application/zip",

            "application/x-zip-compressed",

            "text/plain",

        ];

        if (!allowed.includes(req.file.mimetype)) {

            return res.status(400).json({

                success: false,

                error: "Invalid document type.",

            });

        }

        //////////////////////////////////////////////////////
        // BUILD URL
        //////////////////////////////////////////////////////

        const baseUrl =

            process.env.BASE_URL ||

            `${req.protocol}://${req.get("host")}`;

        const documentUrl =

            `${baseUrl}/${req.file.path.replace(/\\/g, "/")}`;

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(200).json({

            success: true,

            mediaType: "document",

            document: {

                fileName: req.file.filename,

                originalName: req.file.originalname,

                mimeType: req.file.mimetype,

                extension: path.extname(

                    req.file.originalname,

                ),

                size: req.file.size,

                url: documentUrl,

                path: req.file.path.replace(/\\/g, "/"),

            },

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error: error.message,

        });

    }

};

module.exports = uploadDocumentController;