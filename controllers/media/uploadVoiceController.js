const path = require("path");

const uploadVoiceController = async (req, res) => {

    try {

        //////////////////////////////////////////////////////
        // FILE REQUIRED
        //////////////////////////////////////////////////////

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No voice message uploaded.",
            });
        }

        //////////////////////////////////////////////////////
        // VALIDATE VOICE
        //////////////////////////////////////////////////////

        const extension = path
            .extname(req.file.originalname)
            .toLowerCase();

        const allowedExtensions = [
            ".m4a",
            ".aac",
            ".opus",
            ".ogg",
            ".wav",
            ".amr",
            ".3gp",
            ".caf",
            ".mp3",
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
                error: "Unsupported voice format.",
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

            mediaType: "voice",

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

module.exports = uploadVoiceController;