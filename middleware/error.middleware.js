const CustomErrorHandler = require("../error/custom-error-handler");

module.exports = function (err, req, res, next) {
  try {
    if (err instanceof CustomErrorHandler) {
      return res
        .status(err.status)
        .json({ message: err.message, errors: err.errors });
    }
    if(err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(item => item.message)
      return res.status(400).json({
        message: "ValidationError",
        errors: validationErrors
      })
    }
    if (err.name === "MongoServerError") {
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        return res.status(400).json({
          message: "Duplicate Key Error",
          errors: [`${field} qiymati allaqachon mavjud: "${value}"`],
        });
      }

      // boshqa Mongo errorlar uchun
      return res.status(400).json({
        message: "Mongo Server Error",
        errors: [err.message],
      });
    }
    next()
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
