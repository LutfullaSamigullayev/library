const { Router } = require("express");
const uploadImg = require("../utils/upload");
const { addImage } = require("../controller/image.controller");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminCheskerMiddleware = require("../middleware/admin.chesker.middleware");

const ImageRouter = Router();

ImageRouter.post(
  "/add_image",
  authorizationMiddleware,
  adminCheskerMiddleware,
  uploadImg.single("upload"),
  addImage
);

module.exports = ImageRouter;
