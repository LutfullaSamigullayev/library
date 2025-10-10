const { Router } = require("express");
const { register, login, toAdmin } = require("../controller/auth.controller");
const authValidatorMiddleware = require("../middleware/auth.validator.middleware");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const super_adminCheskerMiddleware = require("../middleware/super_admin.chesker.middleware");

const AuthRouter = Router();

AuthRouter.post("/register", authValidatorMiddleware, register);
AuthRouter.post("/login", login);
AuthRouter.put("/to_admin/:id", authorizationMiddleware, super_adminCheskerMiddleware, toAdmin)

module.exports = AuthRouter;
