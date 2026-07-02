const { cleanEnv, str, port } = require("envalid");

module.exports = cleanEnv(process.env, {

  PORT: port(),

  DATABASE_URL: str(),

  JWT_SECRET: str(),

  JWT_EXPIRES: str(),

  REFRESH_TOKEN_SECRET: str(),

  REFRESH_TOKEN_EXPIRES: str(),

});