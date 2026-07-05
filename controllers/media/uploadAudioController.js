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

        if (!req.file.mimetype.startsWith("audio/")) {

            return res.status(400).json({

                success: false,

                error: "Invalid audio file.",

            });

        }

        const extension = path
            .extname(req.file.originalname)
            .toLowerCase();

        const allowed = [

            ".mp3",

            ".wav",

            ".flac",

            ".aac",

            ".m4a",

            ".ogg",

            ".wma",

        ];

        if (!allowed.includes(extension)) {

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

        const audioUrl =

            `${baseUrl}/${req.file.path.replace(/\\/g, "/")}`;

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(200).json({

            success: true,

            mediaType: "audio",

            audio: {

                fileName: req.file.filename,

                originalName: req.file.originalname,

                mimeType: req.file.mimetype,

                extension,

                size: req.file.size,

                url: audioUrl,

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

module.exports = uploadAudioController;