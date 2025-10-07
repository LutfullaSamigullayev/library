const {Router} = require('express')
const { getAllAuthors, search, getOneAuthor, addAuthor, updateAuthor, deleteAuthor } = require('../controller/author.controller')

const AuthorRouter = Router()

AuthorRouter.get("/get_all_authors", getAllAuthors)
AuthorRouter.get("/search_author", search)
AuthorRouter.get("/get_one_author/:id", getOneAuthor)
AuthorRouter.post("/add_author", addAuthor)
AuthorRouter.put("/update_author/:id", updateAuthor)
AuthorRouter.delete("/delete_author/:id", deleteAuthor)

module.exports = AuthorRouter

