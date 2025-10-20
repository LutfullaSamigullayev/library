const joi = require("joi");

const paperBookValidator = (data) => {
  const schema = joi.object({
    weight_gram: joi.number().min(10).max(5000).required(),
    count: joi.number().min(0).max(1000).required(),
  });
  return schema.validate(data, {abortEarly: false});
};

module.exports = paperBookValidator;
