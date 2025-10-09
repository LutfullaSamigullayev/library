const CustomErrorHandler = require("../error/custom-error-handler");

module.exports = function (err, req, res, next) {
  if (err instanceof CustomErrorHandler) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  req.status(500).json({ message: "Interval server error" });
};
