const joi = require("joi");

const citationValidator = (data) => {
  const schema = joi.object({
    text: joi.string().min(5).max(500).trim().required().messages({
      "string.empty": "Iqtibos kiritilishi kerak!",
      "string.min": "Iqtibos kamida 5 ta belgidan iborat bo‘lishi kerak!",
      "string.max": "Iqtibos 500 ta belgidan oshmasligi kerak!",
    }),
    book_id: joi.string().required().messages({
      "string.empty": "Kitob ID kiritilishi kerak!",
      "any.required": "Kitob ID bo‘lishi shart!",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = citationValidator;
