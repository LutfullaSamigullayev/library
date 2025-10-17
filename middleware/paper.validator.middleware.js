const CustomErrorHandler = require("../error/custom-error-handler");
const paperBookValidator = require("../validator/paper.validator");

const paperValidatorMiddleware = (req, res, next) => {
  try {
    const { error } = paperBookValidator(req.body);
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

module.exports = paperValidatorMiddleware