const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../error/custom-error-handler");

module.exports = function (req, res, next) {
  try {
    const refresh_token = req.cookies.RefreshToken;
    if (!refresh_token) {
      throw CustomErrorHandler.UnAuthorized("Token not found");
    }
    
    jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
      if (err) {
        throw CustomErrorHandler.Forbidden("Invalid token");
      }
      req.user = decoded;
    });
    
    next();
  } catch (error) {
    next(error);
  }
};
