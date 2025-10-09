const CustomErrorHandler = require("../error/custom-error-handler");
const authorValidator = require("../validator/author.validator");

const authorValidatorMiddleware = (req, res, next) => {
  try {
    const { error } = authorValidator(req.body);
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

module.exports = authorValidatorMiddleware