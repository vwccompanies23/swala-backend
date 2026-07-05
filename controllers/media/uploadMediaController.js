const path = require("path");

const uploadMediaController = async (req, res) => {

    try {

        //////////////////////////////////////////////////////
        // FILE REQUIRED
        //////////////////////////////////////////////////////

        if (!req.file) {

            return res.status(400).json({

                success: false,

                error: "No file uploaded.",

            });

        }

        //////////////////////////////////////////////////////
        // FILE INFO
        //////////////////////////////////////////////////////

        const file = req.file;

        const mime = file.mimetype;

        let mediaType = "document";

        if (mime.startsWith("image/")) {

            mediaType = "image";

        }

        else if (mime.startsWith("video/")) {

            mediaType = "video";

        }

        else if (mime.startsWith("audio/")) {

            const ext = path
                .extname(file.originalname)
                .toLowerCase();

            if (

                ext === ".m4a" ||

                ext === ".aac" ||

                ext === ".opus"

            ) {

                mediaType = "voice";

            }

            else {

                mediaType = "audio";

            }

        }

        //////////////////////////////////////////////////////
        // BUILD FILE URL
        //////////////////////////////////////////////////////

        const baseUrl =

            process.env.BASE_URL ||

            `${req.protocol}://${req.get("host")}`;

        const fileUrl =

            `${baseUrl}/${file.path.replace(/\\/g, "/")}`;

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            media: {

                type: mediaType,

                originalName: file.originalname,

                filename: file.filename,

                mimeType: file.mimetype,

                size: file.size,

                url: fileUrl,

                path: file.path.replace(/\\/g, "/"),

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

module.exports = uploadMediaController;