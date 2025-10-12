const Joi = require("joi");

// 🔹 Ro‘yxatdan o‘tish uchun validator
const registerValidator = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      "string.base": "Username matn bo‘lishi kerak!",
      "string.empty": "Username kiritilishi shart!",
      "string.min": "Username eng kamida 3 ta belgidan iborat bo‘lishi kerak!",
      "any.required": "Username maydoni majburiy!",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Email to‘g‘ri formatda bo‘lishi kerak!",
      "any.required": "Email kiritilishi shart!",
    }),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$"))
      .required()
      .messages({
        "string.min": "Parol eng kamida 6 ta belgidan iborat bo‘lishi kerak!",
        "string.pattern.base":
          "Parolda kamida bitta katta harf, kichik harf va raqam bo‘lishi kerak!",
        "any.required": "Parol kiritilishi shart!",
      }),
  });
  return schema.validate(data, { abortEarly: false });
};

// 🔹 Login uchun validator
const loginValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data, { abortEarly: false });
};

// 🔹 Parolni unutgan foydalanuvchi uchun validator
const forgetPasswordValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email to‘g‘ri formatda bo‘lishi kerak!",
      "any.required": "Email kiritilishi shart!",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

// 🔹 Parolni tiklash (reset) uchun validator
const resetPasswordValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.length": "Tasdiqlash kodi 6 ta raqamdan iborat bo‘lishi kerak!",
        "string.pattern.base":
          "Tasdiqlash kodi faqat raqamlardan iborat bo‘lishi kerak!",
      }),
    new_password: Joi.string()
      .min(6)
      .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$"))
      .required()
      .messages({
        "string.min": "Parol eng kamida 6 ta belgidan iborat bo‘lishi kerak!",
        "string.pattern.base":
          "Parolda kamida bitta katta harf, kichik harf va raqam bo‘lishi kerak!",
      }),
    repeat_password: Joi.ref("new_password")
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  registerValidator,
  loginValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
};
