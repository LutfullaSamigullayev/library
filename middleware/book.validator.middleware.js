const CustomErrorHandler = require("../error/custom-error-handler");
const bookValidator = require("../validator/book.validator");

const bookValidatorMiddleware = (req, res, next) => {
  try {
    const { error } = bookValidator(req.body);
    if (error) {
      const errors = error.details.map((item) => item.message); 
      const message = error.name 
      throw CustomErrorHandler.BadRequest(message, errors);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = bookValidatorMiddleware