const {Router} = require('express')
const { getAllBooks, search, getOneBook, addBook, updateBook, deleteBook } = require('../controller/book.controller')
const bookValidatorMiddleware = require('../middleware/book.validator.middleware')

const BookRouter = Router()

BookRouter.get("/get_all_books", getAllBooks)
BookRouter.get("/search_book", search)
BookRouter.get("/get_one_book/:id", getOneBook)
BookRouter.post("/add_book", bookValidatorMiddleware, addBook)
BookRouter.put("/update_book/:id", updateBook)
BookRouter.delete("/delete_book/:id", deleteBook)

module.exports = BookRouter

