const { Router } = require("express");
const {
  getAllCitations,
  addCitation,
  updateCitation,
  deleteCitation,
} = require("../controller/citation.controller");
const citationValidatorMiddleware = require("../middleware/citation.validator.middleware");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminCheskerMiddleware = require("../middleware/admin.chesker.middleware");

const CitationRouter = Router();

CitationRouter.get("/get_all_citations", getAllCitations);
CitationRouter.post("/add_citation",  authorizationMiddleware, adminCheskerMiddleware, citationValidatorMiddleware, addCitation);
CitationRouter.put("/update_citation/:id",  authorizationMiddleware, adminCheskerMiddleware, updateCitation);
CitationRouter.delete("/delete_citation/:id",  authorizationMiddleware, adminCheskerMiddleware, deleteCitation);

module.exports = CitationRouter;
