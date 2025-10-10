const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../error/custom-error-handler");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw CustomErrorHandler.NotFound("Token not found");
    }
    const [bearer, accsess_token] = token.split(" ");
    if (bearer !== "Bearer" || !accsess_token) {
      throw CustomErrorHandler.UnAuthorized(
        "Bearer not found or invalid access token"
      );
    }
    jwt.verify(accsess_token, process.env.SECRET_KEY, (err, decoded) => {
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
