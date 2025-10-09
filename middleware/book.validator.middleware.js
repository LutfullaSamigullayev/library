const bookValidator = require("../validator/book.validator");

const bookValidatorMiddleware = (req, res, next) => {
  try {
    const { error } = bookValidator(req.body);
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

module.exports = bookValidatorMiddleware