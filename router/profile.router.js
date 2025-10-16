const { Router } = require("express");

const authorizationMiddleware = require("../middleware/authorization.middleware");
const {
  getProfile,
  editProfile,
  editPassword,
} = require("../controller/profile.controller");
const profileValidatorMiddleware = require("../middleware/profile.validator.middleware");

const ProfileRouter = Router();

ProfileRouter.get("/get_profile", authorizationMiddleware, getProfile);
ProfileRouter.put(
  "/edit_profile",
  profileValidatorMiddleware("profile"),
  authorizationMiddleware,
  editProfile
);
ProfileRouter.put(
  "/edit_password",
  profileValidatorMiddleware("password"),
  authorizationMiddleware,
  editPassword
);

module.exports = ProfileRouter;
