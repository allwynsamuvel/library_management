const joi = require("joi");

/**
 * Joi schema for validation.
 */
exports.joiSchema = joi.object({
  name: joi
    .string()
    .pattern(new RegExp(/^[a-zA-Z, ]+$/))
    .message({ "string.pattern.base": "Enter valid name" }),
  phone: joi
    .string()
    .length(10)
    .pattern(new RegExp(/^[0-9]*$/))
    .messages({
      "string.pattern.base": "Enter valid phone no.",
      "string.length": "Phone no. should be in 10 digit.",
    }),
  email: joi.string().email().lowercase(),
  password: joi
    .string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
    .message({
      "string.pattern.base":
        "Enter Valid Password (Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
    }),
  role: joi.string(),
});
