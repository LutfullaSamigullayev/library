const { Router } = require("express");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminSuper_adminCheskerMiddleware = require("../middleware/admin-super_admin.chesker.middleware");
const { getAllPapers, searchPaper, getOnePaper, addPaper, updatePaper, deletePaper } = require("../controller/paper.controller");
const paperValidatorMiddleware = require("../middleware/paper.validator.middleware");

const PaperRouter = Router();

PaperRouter.get("/get_all_papers", getAllPapers);
PaperRouter.get("/search_paper", searchPaper);
PaperRouter.get("/get_one_paper/:id", getOnePaper);
PaperRouter.post(
  "/add_paper/:bookId",
  paperValidatorMiddleware,
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  addPaper
);
PaperRouter.put(
  "/paper/:bookId/:partId",
  paperValidatorMiddleware,
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  updatePaper
);
PaperRouter.delete(
  "/paper/:bookId/:partId",
  authorizationMiddleware,
  adminSuper_adminCheskerMiddleware,
  deletePaper
);

module.exports = PaperRouter;
