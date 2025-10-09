const joi = require("joi");

const currentYear = new Date().getFullYear();

const bookValidator = (data) => {
  const schema = joi.object({
    title: joi.string().min(2).max(50).trim().required().messages({
      "string.empty": "Kitob nomi kiritilishi kerak!",
      "string.min": "Kitob nomi kamida 2 ta belgidan iborat bo‘lishi kerak!",
      "string.max": "Kitob nomi 50 ta belgidan oshmasligi kerak!",
    }),
    img: joi.string().uri().messages({
      "string.uri": "Rasm URL manzili to‘g‘ri formatda bo‘lishi kerak!",
    }),
    genre: joi
      .string()
      .valid(
        "Roman",
        "Qissa",
        "Hikoya",
        "She’r",
        "Doston",
        "Drama",
        "Fantastika",
        "Essye",
        "Tarixiy",
        "Ilmiy-ommabop",
        "Dostonlar to‘plami"
      )
      .required()
      .messages({
        "any.only": "Janr noto‘g‘ri! Faqat mavjud janrlarni kiriting! Masalan: Roman, Qissa, Hikoya, She’r, Doston, Drama, Fantastika, Essye, Tarixiy, Ilmiy-ommabop, Dostonlar to‘plami",
        "string.empty": "Janr kiritilishi kerak!",
      }),
    published_year: joi
      .number()
      .integer()
      .min(1)
      .max(currentYear)
      .required()
      .messages({
        "number.base": "Nashr yili raqam bo‘lishi kerak!",
        "number.max": `Nashr yili ${currentYear}-yildan katta bo‘lishi mumkin emas!`,
        "any.required": "Nashr yili kiritilishi shart!",
      }),
    published_home: joi.string().min(2).max(100).required().trim().messages({
      "string.empty": "Nashriyot nomi kiritilishi kerak!",
      "string.min":
        "Nashriyot nomi kamida 2 ta belgidan iborat bo‘lishi kerak!",
      "string.max": "Nashriyot nomi 100 belgidan oshmasligi kerak!",
    }),
    page: joi.number().integer().min(4).max(2000).required().messages({
      "number.base": "Sahifa soni raqam bo‘lishi kerak!",
      "number.min": "Kitob kamida 4 sahifadan iborat bo‘lishi kerak!",
      "number.max": "Kitob 2000 sahifadan oshmasligi kerak!",
    }),
    desc: joi.string().min(10).max(1000).trim().required().messages({
      "string.empty": "Kitob haqida ma’lumot kiritilishi kerak!",
      "string.min": "Tavsif kamida 10 ta belgidan iborat bo‘lishi kerak!",
      "string.max": "Tavsif 1000 ta belgidan oshmasligi kerak!",
    }),
    author_info: joi.string().required().messages({
      "string.empty": "Muallif ID kiritilishi kerak!",
      "any.required": "Muallif ID bo‘lishi shart!",
    }),
  });

  return schema.validate(data, {abortEarly: false});
};

module.exports = bookValidator;
