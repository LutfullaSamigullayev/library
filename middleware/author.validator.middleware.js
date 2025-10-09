const authorValidator = require("../validator/author.validator");

const authorValidatorMiddleware = (req, res, next) => {
  try {
    const { error } = authorValidator(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorValidatorMiddleware