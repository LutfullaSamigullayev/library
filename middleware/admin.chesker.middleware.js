const CustomErrorHandler = require("../error/custom-error-handler");

module.exports = function (req, res, next) {
  try {
    const { role } = req.user;
    if (role === "admin") {
        next();
    } else {
      throw CustomErrorHandler.UnAuthorized("Siz Admin emassiz");
    }
  } catch (error) {
    next(error);
  }
};
