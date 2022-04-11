const joi = require("joi");

/**
 * Joi schema for validation.
 */
exports.joiSchema = joi.object({
    name: joi.string().pattern(new RegExp(/^[a-zA-Z, ]+$/)).message({"string.pattern.base": "Enter valid name"}),
    phone: joi.number(),
    email: joi.string().email().lowercase(),
    password: joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
    .message({"string.pattern.base": "Enter Valid Password (Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"}),
    role: joi.string().default("customer")
});