const joi = require("joi");

const currentYear = new Date().getFullYear();

const authorValidator = (data) => {
  const schema = joi.object({
    full_name: joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "Muallifning to‘liq ismi kiritilishi kerak!",
        "string.pattern.base": "Ism faqat harflar va bo‘sh joylardan iborat bo‘lishi kerak!",
        "string.min": "Ism kamida 3 ta belgidan iborat bo‘lishi kerak!",
        "string.max": "Ism 50 ta belgidan oshmasligi kerak!",
      }),
    birth_date: joi.date()
      .iso()
      .max(`${currentYear - 5}-12-31`)
      .required()
      .messages({
        "date.base": "Tug‘ilgan sana noto‘g‘ri formatda!",
        "any.required": "Tug‘ilgan sana kiritilishi kerak!",
        "date.max": "Tug‘ilgan sana hozirgi sanadan kamida 5 yil oldin bo‘lishi kerak!",
      }),
     death_date: joi.date()
     .iso()
     .max("now")
     .optional()
     .allow(null, "")
     .custom((value, helpers) => {
       const { birth_date } = helpers.state.ancestors[0];
       if (!value) return value; 
       if (birth_date && new Date(value) <= new Date(birth_date)) {
         return helpers.message("O‘lim sanasi tug‘ilgan sanadan keyin bo‘lishi kerak!");
       }
       return value;
     })
     .messages({
       "date.base": "O‘lim sanasi noto‘g‘ri formatda!",
       "date.max": "O‘lim sanasi hozirgi sanadan oldin bo‘lishi kerak!",
     }),
    img: joi.string()
      .uri()
      .messages({
        "string.uri": "Rasm URL manzili to‘g‘ri formatda bo‘lishi kerak!",
      }),
    bio: joi.string()
      .min(20)
      .max(1000)
      .trim()
      .required()
      .messages({
        "string.empty": "Biografiya kiritilishi kerak!",
        "string.min": "Biografiya kamida 20 ta belgidan iborat bo‘lishi kerak!",
        "string.max": "Biografiya 1000 belgidan oshmasligi kerak!",
      }),
    creativity: joi.string()
      .min(10)
      .max(500)
      .trim()
      .required()
      .messages({
        "string.empty": "Ijodiy faoliyat haqida ma’lumot kiritilishi kerak!",
        "string.min": "Ijodiy tavsif kamida 10 ta belgidan iborat bo‘lishi kerak!",
        "string.max": "Ijodiy tavsif 500 belgidan oshmasligi kerak!",
      }),
    region: joi.string()
      .min(3)
      .max(50)
      .trim()
      .required()
      .messages({
        "string.empty": "Hudud (region) kiritilishi kerak!",
        "string.min": "Hudud nomi kamida 3 ta belgidan iborat bo‘lishi kerak!",
        "string.max": "Hudud nomi 50 ta belgidan oshmasligi kerak!",
      }),
    period: joi.string()
      .valid(
        "Temuriylar davri",
        "Jadid adabiyoti",
        "Sovet davri",
        "Mustaqillik davri"
      )
      .required()
      .messages({
        "any.only": "Davr noto‘g‘ri! Faqat quyidagi davrlardan birini tanlang: Temuriylar davri, Jadid adabiyoti, Sovet davri, Mustaqillik davri.",
        "string.empty": "Davr kiritilishi kerak!",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = authorValidator;
