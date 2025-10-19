const { Router } = require("express");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminSuper_adminCheskerMiddleware = require("../middleware/admin-super_admin.chesker.middleware");
const { addfile } = require("../controller/file.controller");

const FileRouter = Router();

FileRouter.post(
  "/add_file",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  addfile
);

module.exports = FileRouter;
