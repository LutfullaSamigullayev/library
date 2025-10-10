const Joi = require("joi");

const registerValidator = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = registerValidator;
