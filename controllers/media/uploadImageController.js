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
    // ACCEPT ALL COMMON IMAGE TYPES
    //////////////////////////////////////////////////////

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".heic",
      ".heif",
      ".tif",
      ".tiff",
      ".svg",
      ".jfif",
      ".avif",
    ];

    const mime = (req.file.mimetype || "").toLowerCase();

    const allowedMime =
      mime.startsWith("image/") ||
      mime === "application/octet-stream";

    if (
      !allowedMime &&
      !allowedExtensions.includes(extension)
    ) {
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

    const url =
      `${baseUrl}/${req.file.path.replace(/\\/g, "/")}`;

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return res.status(200).json({
      success: true,
      url,
      mediaType: "image",
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

module.exports = uploadImageController;