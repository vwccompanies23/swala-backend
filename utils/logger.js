class Logger {

  static info(message) {

    console.log(

      "✅",

      message,

    );

  }

  static warning(message) {

    console.warn(

      "⚠️",

      message,

    );

  }

  static error(error) {

    console.error(

      "❌",

      error,

    );

  }

}

module.exports = Logger;