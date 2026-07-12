const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

const uploadPostMediaController = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                error: "No media uploaded",

            });

        }

        //////////////////////////////////////////////////////
        // UPLOAD TO CLOUDINARY
        //////////////////////////////////////////////////////

        const result = await cloudinary.uploader.upload(

            req.file.path,

            {

                folder: "swala/posts",

                resource_type: "auto",

            },

        );

        //////////////////////////////////////////////////////
        // DELETE LOCAL FILE
        //////////////////////////////////////////////////////

        try {

            fs.unlinkSync(req.file.path);

        } catch (_) {}

        //////////////////////////////////////////////////////
        // RESPONSE
        //////////////////////////////////////////////////////

        return res.json({

            success: true,

            media_url: result.secure_url,

            cloudinary_public_id: result.public_id,

            file_name: req.file.originalname,

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

module.exports = uploadPostMediaController;