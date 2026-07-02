class Response {

  static success(res, data = {}, message = "Success") {

    return res.status(200).json({

      success: true,

      message,

      data,

    });

  }

  static created(res, data = {}, message = "Created") {

    return res.status(201).json({

      success: true,

      message,

      data,

    });

  }

  static badRequest(res, message) {

    return res.status(400).json({

      success: false,

      error: message,

    });

  }

  static unauthorized(res, message = "Unauthorized") {

    return res.status(401).json({

      success: false,

      error: message,

    });

  }

  static forbidden(res, message = "Forbidden") {

    return res.status(403).json({

      success: false,

      error: message,

    });

  }

  static notFound(res, message = "Not Found") {

    return res.status(404).json({

      success: false,

      error: message,

    });

  }

  static serverError(res, error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      error: error.message,

    });

  }

}

module.exports = Response;