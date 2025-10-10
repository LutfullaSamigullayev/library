const {Router} = require('express')
const { getAllBooks, search, getOneBook, addBook, updateBook, deleteBook } = require('../controller/book.controller')
const bookValidatorMiddleware = require('../middleware/book.validator.middleware')
const authorizationMiddleware = require("../middleware/authorization.middleware");
const adminCheskerMiddleware = require("../middleware/admin.chesker.middleware");

const BookRouter = Router()

BookRouter.get("/get_all_books", getAllBooks)
BookRouter.get("/search_book", search)
BookRouter.get("/get_one_book/:id", getOneBook)
BookRouter.post("/add_book",  authorizationMiddleware, adminCheskerMiddleware, bookValidatorMiddleware, addBook)
BookRouter.put("/update_book/:id",  authorizationMiddleware, adminCheskerMiddleware, updateBook)
BookRouter.delete("/delete_book/:id",  authorizationMiddleware, adminCheskerMiddleware, deleteBook)

module.exports = BookRouter

