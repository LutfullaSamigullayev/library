const BookSchema = require("../schema/book.schema")

const getAllBooks = async (req, res) => {
    try {
        const books = await BookSchema.find()
        res.status(200).json(books)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const search = async (req, res) => {
    try {
        const {title} = req.query
        const search = await BookSchema.find({
            title: {$regex: title, $options: "i"}
        })
        res.status(201).json(search)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getOneBook = async (req, res) => {
    try {
        const {id} = req.params
        const foundedBook = await BookSchema.findById(id)
        if(!foundedBook) {
            res.status(404).json({message: "Book not found"})
        }
        res.status(201).json(foundedBook)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const addBook = async (req, res) => {
    try {
        const {title, img, bio, period, genre, pulishedYear, pulishedHome, page, desc } = req.body
        await BookSchema.create({title, img, bio, period, genre, pulishedYear, pulishedHome, page, desc })
        res.status(201).json({message: "Added new book"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const updateBook = async (req, res) => {
    try {
        const {title, img, bio, period, genre, pulishedYear, pulishedHome, page, desc } = req.body
        const {id} = req.params
        const foundedBook = await BookSchema.findById(id)
        if(!foundedBook) {
            res.status(404).json({message: "Book not found"})
        }
        await BookSchema.findByIdAndUpdate(id, {title, img, bio, period, genre, pulishedYear, pulishedHome, page, desc })
        res.status(201).json({message: "Update book"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const deleteBook = async (req, res) => {
    try {
        const {id} = req.params
        const foundedBook = await BookSchema.findById(id)
        if(!foundedBook) {
            res.status(404).json({message: "Book not found"})
        }
        await BookSchema.findByIdAndDelete(id)
        res.status(201).json({message: "Delete book"})
    } catch (error) {
        res.status(500).json({message: error.message})
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