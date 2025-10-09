const citationValidator = require("../validator/citation.validator");

const citationValidatorMiddleware = (req, res, next) => {
  try {
    const { error } = citationValidator(req.body);
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

module.exports = citationValidatorMiddleware