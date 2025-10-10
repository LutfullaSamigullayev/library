const CustomErrorHandler = require("../error/custom-error-handler");

module.exports = function (req, res, next) {
  try {
    const { role } = req.user;
    if (role === "super_admin") {
        next();
    } else {
      throw CustomErrorHandler.UnAuthorized("Siz Super Admin emassiz");
    }
  } catch (error) {
    next(error);
  }
};
