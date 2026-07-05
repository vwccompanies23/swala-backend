const path = require("path");

const uploadAudioController = async (req, res) => {

    try {

        //////////////////////////////////////////////////////
        // FILE REQUIRED
        //////////////////////////////////////////////////////

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No audio file uploaded.",
            });
        }

        //////////////////////////////////////////////////////
        // VALIDATE AUDIO
        //////////////////////////////////////////////////////

        const extension = path
            .extname(req.file.originalname)
            .toLowerCase();

        const allowedExtensions = [

            ".mp3",

            ".wav",

            ".flac",

            ".aac",

            ".m4a",

            ".ogg",

            ".wma",

            ".opus",

            ".aiff",

            ".caf",

            ".amr",

            ".3gp",

        ];

        const mime = (req.file.mimetype || "").toLowerCase();

        const validMime =
            mime.startsWith("audio/") ||
            mime === "application/octet-stream";

        if (
            !validMime &&
            !allowedExtensions.includes(extension)
        ) {
            return res.status(400).json({
                success: false,
                error: "Unsupported audio format.",
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

            mediaType: "audio",

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

module.exports = uploadAudioController;