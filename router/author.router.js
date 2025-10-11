const { Router } = require("express");
const {
  getAllAuthors,
  search,
  getOneAuthor,
  addAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controller/author.controller");
const authorValidatorMiddleware = require("../middleware/author.validator.middleware");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminSuper_adminCheskerMiddleware = require("../middleware/admin-super_admin.chesker.middleware");

const AuthorRouter = Router();

AuthorRouter.get("/get_all_authors", getAllAuthors);
AuthorRouter.get("/search_author", search);
AuthorRouter.get("/get_one_author/:id", getOneAuthor);
AuthorRouter.post(
  "/add_author",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  authorValidatorMiddleware,
  addAuthor
);
AuthorRouter.put(
  "/update_author/:id",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  updateAuthor
);
AuthorRouter.delete(
  "/delete_author/:id",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  deleteAuthor
);

module.exports = AuthorRouter;
