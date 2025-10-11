const { Router } = require("express");
const {
  getAllCitations,
  addCitation,
  updateCitation,
  deleteCitation,
} = require("../controller/citation.controller");
const citationValidatorMiddleware = require("../middleware/citation.validator.middleware");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminSuper_adminCheskerMiddleware = require("../middleware/admin-super_admin.chesker.middleware");

const CitationRouter = Router();

CitationRouter.get("/get_all_citations", getAllCitations);
CitationRouter.post("/add_citation",  authorizationMiddleware, adminSuper_adminCheskerMiddleware, citationValidatorMiddleware, addCitation);
CitationRouter.put("/update_citation/:id", authorizationMiddleware, adminSuper_adminCheskerMiddleware, updateCitation);
CitationRouter.delete("/delete_citation/:id", authorizationMiddleware, adminSuper_adminCheskerMiddleware, deleteCitation);

module.exports = CitationRouter;
