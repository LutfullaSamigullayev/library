const CustomErrorHandler = require("../error/custom-error-handler");
const {
  registerValidator,
  loginValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
} = require("../validator/auth.validator");

const authValidatorMiddleware = (type) => {
  return (req, res, next) => {
    try {
      let validator;

      switch (type) {
        case "register":
          validator = registerValidator;
          break;
        case "login":
          validator = loginValidator;
          break;
        case "forget":
          validator = forgetPasswordValidator;
          break;
        case "reset":
          validator = resetPasswordValidator;
          break;
        default:
          throw new Error("Validator turi noto‘g‘ri belgilangan!");
      }
      const { error } = validator(req.body);

      if (error) {
        const errors = error.details.map((item) => item.message);
        throw CustomErrorHandler.BadRequest("ValidationError", errors);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = authValidatorMiddleware;
