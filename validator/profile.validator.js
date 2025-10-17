const joi = require("joi");

const editProfileValidator = (data) => {
  const schema = joi.object({
    firstName: joi.string().min(1).max(20).required().messages({
      "string.base": "Ism matn bo‘lishi kerak!",
      "string.empty": "Ism kiritilishi shart!",
      "string.min": "Ism eng kamida 1 ta belgidan iborat bo‘lishi kerak!",
      "any.required": "Ism maydoni majburiy!",
    }),
    lastName: joi.string().min(1).max(20).required().messages({
      "string.base": "Familiya matn bo‘lishi kerak!",
      "string.empty": "Familiya kiritilishi shart!",
      "string.min": "Familiya eng kamida 1 ta belgidan iborat bo‘lishi kerak!",
      "any.required": "Familiya maydoni majburiy!",
    }),
    email: joi.string().email().required().messages({
      "string.email": "Email to‘g‘ri formatda bo‘lishi kerak!",
      "any.required": "Email kiritilishi shart!",
    }),
    phoneNumber: joi.string()
      .pattern(/^\+?\d{9,15}$/)
      .messages({
        "string.pattern.base":
          "Telefon raqam noto‘g‘ri formatda! (masalan: +998901234567)",
      })
      .allow(null, ""),
  });

  return schema.validate(data, { abortEarly: false });
};

const editPasswordValidator = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    currentPassword: joi.string()
      .min(6)
      .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$"))
      .required()
      .messages({
        "string.min": "Parol eng kamida 6 ta belgidan iborat bo‘lishi kerak!",
        "string.pattern.base":
          "Parolda kamida bitta katta harf, kichik harf va raqam bo‘lishi kerak!",
      }),
    newPassword: joi.string()
      .min(6)
      .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$"))
      .required()
      .messages({
        "string.min": "Parol eng kamida 6 ta belgidan iborat bo‘lishi kerak!",
        "string.pattern.base":
          "Parolda kamida bitta katta harf, kichik harf va raqam bo‘lishi kerak!",
      }),
    repeatPassword: joi.ref("new_password"),
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  editProfileValidator,
  editPasswordValidator
};
