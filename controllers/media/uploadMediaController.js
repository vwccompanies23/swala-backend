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

    const file = req.file;

    const mime = (file.mimetype || "").toLowerCase();

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    //////////////////////////////////////////////////////
    // EXTENSION LISTS
    //////////////////////////////////////////////////////

    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".heic",
      ".heif",
      ".jfif",
      ".avif",
      ".svg",
      ".tif",
      ".tiff",
    ];

    const videoExtensions = [
      ".mp4",
      ".mov",
      ".avi",
      ".mkv",
      ".webm",
      ".3gp",
      ".m4v",
      ".mpeg",
      ".mpg",
    ];

    const voiceExtensions = [
      ".opus",
      ".aac",
      ".m4a",
      ".amr",
    ];

    const audioExtensions = [
      ".mp3",
      ".wav",
      ".ogg",
      ".flac",
      ".aac",
      ".m4a",
      ".opus",
      ".aiff",
      ".wma",
    ];

    const documentExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".txt",
      ".zip",
      ".rar",
      ".7z",
      ".csv",
      ".json",
      ".xml",
    ];

    //////////////////////////////////////////////////////
    // DETECT MEDIA TYPE
    //////////////////////////////////////////////////////

    let mediaType = "document";

    if (
      mime.startsWith("image/") ||
      imageExtensions.includes(extension)
    ) {
      mediaType = "image";
    }

    else if (
      mime.startsWith("video/") ||
      videoExtensions.includes(extension)
    ) {
      mediaType = "video";
    }

    else if (
      mime.startsWith("audio/") ||
      audioExtensions.includes(extension)
    ) {
      if (voiceExtensions.includes(extension)) {
        mediaType = "voice";
      } else {
        mediaType = "audio";
      }
    }

    else if (
      documentExtensions.includes(extension)
    ) {
      mediaType = "document";
    }

    //////////////////////////////////////////////////////
    // BUILD URL
    //////////////////////////////////////////////////////

    const baseUrl =
      process.env.BASE_URL ||
      `${req.protocol}://${req.get("host")}`;

    const url =
      `${baseUrl}/${file.path.replace(/\\/g, "/")}`;

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return res.status(200).json({
      success: true,

      url,

      mediaType,

      fileName: file.filename,

      originalName: file.originalname,

      mimeType: file.mimetype,

      extension,

      size: file.size,

      path: file.path.replace(/\\/g, "/"),
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};

module.exports = uploadMediaController;