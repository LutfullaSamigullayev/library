const { Router } = require("express");
const multer = require("multer");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminSuper_adminCheskerMiddleware = require("../middleware/admin-super_admin.chesker.middleware");

const objectIdValidatorMiddleware = require("../middleware/objectId.validator.middleware");
const { getAllEBooks, searchEBook, getOneEBook, addEBook, deleteOneEBook, deleteEBook, updateEBookFile } = require("../controller/ebook.controller");

const EBookRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

EBookRouter.get("/get_all_ebooks", getAllEBooks);
EBookRouter.get("/search_ebook", searchEBook);
EBookRouter.get("/get_one_ebook/:id", getOneEBook);

EBookRouter.post(
  "/add_ebook/:bookId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  objectIdValidatorMiddleware,
  upload.single("file"),
  addEBook
);

EBookRouter.put(
  "/update_ebook/:bookId/:id",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  upload.single("file"),
  updateEBookFile
);

EBookRouter.delete(
  "/delete_one_ebook/:bookId/:id",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  deleteOneEBook
);

EBookRouter.delete(
  "/delete_ebook_book/:bookId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  deleteEBook
);

module.exports = EBookRouter;
