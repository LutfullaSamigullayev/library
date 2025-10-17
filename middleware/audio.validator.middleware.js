const CustomErrorHandler = require("../error/custom-error-handler");
const audioBookValidator = require("../validator/audio.validator");

const audioValidatorMiddleware = (req, res, next) => {
  try {
    const { error } = audioBookValidator(req.body);
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

module.exports = audioValidatorMiddleware