const { Router } = require("express");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminSuper_adminCheskerMiddleware = require("../middleware/admin-super_admin.chesker.middleware");
const uploadFile = require("../utils/upload");
const { addfile } = require("../controller/file.controller");

const FileRouter = Router();

FileRouter.post(
  "/add_file",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  uploadFile.single("upload"),
  addfile
);

module.exports = FileRouter;
