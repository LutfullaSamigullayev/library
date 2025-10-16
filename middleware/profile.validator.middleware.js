const CustomErrorHandler = require("../error/custom-error-handler");
const { editProfileValidator, editPasswordValidator } = require("../validator/profile.validator");

const profileValidatorMiddleware = (type) => {
  return (req, res, next) => {
    try {
      let validator;

      switch (type) {
        case "profile":
          validator = editProfileValidator;
          break;
        case "password":
          validator = editPasswordValidator;
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

module.exports = profileValidatorMiddleware;
