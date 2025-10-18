const { Router } = require("express");
const {
  register,
  login,
  toAdmin,
  verify,
  logout,
  forgetPassword,
  resetPassword,
  handleRefreshToken,
} = require("../controller/auth.controller");
const authValidatorMiddleware = require("../middleware/auth.validator.middleware");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const super_adminCheskerMiddleware = require("../middleware/super_admin.chesker.middleware");
const refreshTokenMiddleware = require("../middleware/refresh.token.middleware");

const AuthRouter = Router();

AuthRouter.post("/register", authValidatorMiddleware("register"), register);
AuthRouter.post("/verify", verify);
AuthRouter.post("/login", authValidatorMiddleware("login"), login);
AuthRouter.post(
  "/forget_password",
  authValidatorMiddleware("forget"),
  forgetPassword
);
AuthRouter.post(
  "/reset_password",
  authValidatorMiddleware("reset"),
  resetPassword
);
AuthRouter.put(
  "/to_admin/:id",
  authorizationMiddleware,
  super_adminCheskerMiddleware,
  toAdmin
);
AuthRouter.get("/refresh", refreshTokenMiddleware, handleRefreshToken );
AuthRouter.get("/logout", logout);

module.exports = AuthRouter;
