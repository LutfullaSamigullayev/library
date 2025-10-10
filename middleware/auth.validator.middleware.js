const CustomErrorHandler = require("../error/custom-error-handler");
const registerValidator = require("../validator/auth.validator");

const authValidatorMiddleware = (req, res, next) => {
    try {
      const { error } = registerValidator(req.body);
      if (error) {
        const errors = error.details.map((item) => item.message);
        const message = "ValidationError";
        throw CustomErrorHandler.BadRequest(message, errors);
      }
      next();
    } catch (err) {
      next(err);
    }
};

module.exports = authValidatorMiddleware;
