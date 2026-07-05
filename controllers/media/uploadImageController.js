const path = require("path");

const uploadImageController = async (req, res) => {

    try {

        //////////////////////////////////////////////////////
        // FILE REQUIRED
        //////////////////////////////////////////////////////

        if (!req.file) {

            return res.status(400).json({

                success: false,

                error: "No image uploaded.",

            });

        }

        //////////////////////////////////////////////////////
        // IMAGE VALIDATION
        //////////////////////////////////////////////////////

        if (!req.file.mimetype.startsWith("image/")) {

            return res.status(400).json({

                success: false,

                error: "Invalid image file.",

            });

        }

        //////////////////////////////////////////////////////
        // BUILD URL
        //////////////////////////////////////////////////////

        const baseUrl =

            process.env.BASE_URL ||

            `${req.protocol}://${req.get("host")}`;

        const imageUrl =

            `${baseUrl}/${req.file.path.replace(/\\/g, "/")}`;

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.status(200).json({

            success: true,

            mediaType: "image",

            image: {

                fileName: req.file.filename,

                originalName: req.file.originalname,

                mimeType: req.file.mimetype,

                extension: path.extname(

                    req.file.originalname,

                ),

                size: req.file.size,

                url: imageUrl,

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

module.exports = uploadImageController;