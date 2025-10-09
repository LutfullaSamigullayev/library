const CustomErrorHandler = require("../error/custom-error-handler")
const BookSchema = require("../schema/book.schema")

const getAllBooks = async (req, res, next) => {
    try {
        const books = await BookSchema.find().populate("author_info")
        res.status(200).json(books)
    } catch (error) {
        next(error)
    }
}

const search = async (req, res, next) => {
    try {
        const {title} = req.query
        const search = await BookSchema.find({
            title: {$regex: title, $options: "i"}
        })
        res.status(201).json(search)
    } catch (error) {
        next(error)
    }
}

const getOneBook = async (req, res, next) => {
    try {
        const {id} = req.params
        const foundedBook = await BookSchema.findById(id)
        if(!foundedBook) {
          throw CustomErrorHandler.NotFound("Book not found")
        }
        res.status(201).json(foundedBook)
    } catch (error) {
        next(error)
    }
}

const addBook = async (req, res, next) => {
    try {
        const {title, img, genre, published_year, published_home, page, desc, author_info } = req.body
        await BookSchema.create({title, img, genre, published_year, published_home, page, desc, author_info })
        res.status(201).json({message: "Added new book"})
    } catch (error) {
        next(error)
    }
}

const updateBook = async (req, res, next) => {
    try {
        const {title, img, genre, published_year, published_home, page, desc, author_info } = req.body
        const {id} = req.params
        const foundedBook = await BookSchema.findById(id)
        if(!foundedBook) {
            throw CustomErrorHandler.NotFound("Book not found")
        }
        await BookSchema.findByIdAndUpdate(id, {title, img, genre, published_year, published_home, page, desc, author_info })
        res.status(201).json({message: "Update book"})
    } catch (error) {
        next(error)
    }
}

const deleteBook = async (req, res, next) => {
    try {
        const {id} = req.params
        const foundedBook = await BookSchema.findById(id)
        if(!foundedBook) {
            throw CustomErrorHandler.NotFound("Book not found")
        }
        await BookSchema.findByIdAndDelete(id)
        res.status(201).json({message: "Delete book"})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllBooks,
    search,
    getOneBook,
    addBook,
    updateBook,
    deleteBook
}