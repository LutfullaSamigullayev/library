const mongoose = require("mongoose");
const CustomErrorHandler = require("../error/custom-error-handler");


const objectIdValidatorMiddleware = (req, res, next) => {
  const id = req.params.id || req.params.bookId || req.params.book_id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw CustomErrorHandler.BadRequest("Noto‘g‘ri ID format!")
  }
  next();
};

module.exports = objectIdValidatorMiddleware;
