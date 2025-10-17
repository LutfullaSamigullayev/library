const joi = require("joi");

const audioBookValidator = (data) => {
  const schema = joi.object({
    title: joi.string().min(2).max(100).required().messages({
      "string.base": "Audio nomi matn bo‘lishi kerak!",
      "string.empty": "Audio nomi kiritilishi shart!",
      "string.min": "Audio nomi eng kamida 2 ta belgidan iborat bo‘lishi kerak!",
      "any.required": "Audio nomi majburiy maydon!",
    }),
  });

  return schema.validate(data, {abortEarly: false});
};

module.exports = audioBookValidator;
