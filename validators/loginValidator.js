const Joi = require("joi");

module.exports = Joi.object({

    phone: Joi.string()

        .required(),

    password: Joi.string()

        .required(),

});