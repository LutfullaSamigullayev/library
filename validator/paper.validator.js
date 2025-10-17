const joi = require("joi");

const paperBookValidator = (data) => {
  const schema = joi.object({
    weight_gram: joi.number().min(10).max(5000).required().message({
      "number.base": "Og'irlik o'lchovi raqam bo'lishi kerak!",
      "number.min": "Og'irlik kamida 10 gramm bo'lishi kerak!",
      "number.max": "Og'irlik ko'pi bilan 5000 gramm bo'lishi kerak!"
    }),
    count: joi.number().min(0).max(1000).required().message({
      "number.base": "Kitob soni raqam bo'lishi kerak!",
      "number.min": "Kitob soni kamida 0 ta bo'lishi kerak!",
      "number.max": "Kitob soni ko'pi bilan 1000 ta bo'lishi kerak!"
    })
  });
  return schema.validate(data, {abortEarly: false});
};

module.exports = paperBookValidator;
