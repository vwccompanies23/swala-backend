const path = require("path");

const uploadStatusMediaController = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                error: "No media uploaded",

            });

        }

        const mediaUrl =

            `/uploads/status/${req.file.filename}`;

        return res.json({

            success: true,

            media_url: mediaUrl,

            file_name: req.file.filename,

            file_size: req.file.size,

            mime_type: req.file.mimetype,

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

module.exports = uploadStatusMediaController;