const { Router } = require("express");
const {
  getAllCitations,
  addCitation,
  updateCitation,
  deleteCitation,
} = require("../controller/citation.controller");
const citationValidatorMiddleware = require("../middleware/citation.validator.middleware");

const CitationRouter = Router();

CitationRouter.get("/get_all_citations", getAllCitations);
CitationRouter.post("/add_citation", citationValidatorMiddleware, addCitation);
CitationRouter.put("/update_citation/:id", updateCitation);
CitationRouter.delete("/delete_citation/:id", deleteCitation);

module.exports = CitationRouter;
