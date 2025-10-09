const CustomErrorHandler = require("../error/custom-error-handler");
const citationValidator = require("../validator/citation.validator");

const citationValidatorMiddleware = (req, res, next) => {
  try {
    const { error } = citationValidator(req.body);
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

module.exports = citationValidatorMiddleware