const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../error/custom-error-handler");

module.exports = function (req, res, next) {
  try {
    const accsess_token = req.cookies.AccessToken;
    if (!accsess_token) {
      throw CustomErrorHandler.UnAuthorized("Token not found");
    }
    
    jwt.verify(accsess_token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
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
