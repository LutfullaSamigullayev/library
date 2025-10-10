const { Router } = require("express");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminCheskerMiddleware = require("../middleware/admin.chesker.middleware");
const uploadFile = require("../utils/upload");
const { addfile } = require("../controller/file.controller");

const FileRouter = Router();

FileRouter.post(
  "/add_file",
  authorizationMiddleware,
  adminCheskerMiddleware,
  uploadFile.single("upload"),
  addfile
);

module.exports = FileRouter;
