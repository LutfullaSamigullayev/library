const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db");
const AuthorRouter = require("./router/author.router");
const BookRouter = require("./router/book.router");
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

connectDB()

// router
app.use(AuthorRouter)
app.use(BookRouter)


app.listen(PORT, () => {
    console.log("Server is running at ", PORT);
})