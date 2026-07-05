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
        // VALIDATE DOCUMENT
        //////////////////////////////////////////////////////

        const extension = path
            .extname(req.file.originalname)
            .toLowerCase();

        const allowedExtensions = [

            ".pdf",

            ".doc",

            ".docx",

            ".xls",

            ".xlsx",

            ".ppt",

            ".pptx",

            ".txt",

            ".csv",

            ".json",

            ".xml",

            ".zip",

            ".rar",

            ".7z",

            ".tar",

            ".gz",

            ".rtf",

            ".odt",

            ".ods",

            ".odp",

        ];

        const mime = (req.file.mimetype || "").toLowerCase();

        const allowedMime = [

            "application/pdf",

            "application/msword",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            "application/vnd.ms-excel",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

            "application/vnd.ms-powerpoint",

            "application/vnd.openxmlformats-officedocument.presentationml.presentation",

            "application/zip",

            "application/x-zip-compressed",

            "application/x-rar-compressed",

            "application/json",

            "application/xml",

            "text/plain",

            "text/csv",

            "application/octet-stream",

        ];

        if (
            !allowedMime.includes(mime) &&
            !allowedExtensions.includes(extension)
        ) {
            return res.status(400).json({
                success: false,
                error: "Unsupported document type.",
            });
        }

        //////////////////////////////////////////////////////
        // BUILD URL
        //////////////////////////////////////////////////////

        const baseUrl =
            process.env.BASE_URL ||
            `${req.protocol}://${req.get("host")}`;

        const url =
            `${baseUrl}/${req.file.path.replace(/\\/g, "/")}`;

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(200).json({

            success: true,

            url,

            mediaType: "document",

            fileName: req.file.filename,

            originalName: req.file.originalname,

            mimeType: req.file.mimetype,

            extension,

            size: req.file.size,

            path: req.file.path.replace(/\\/g, "/"),

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message,
        });

    }

};

module.exports = uploadDocumentController;