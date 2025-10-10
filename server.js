const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db");
const AuthorRouter = require("./router/author.router");
const BookRouter = require("./router/book.router");
const CitationRouter = require("./router/citation.router");
const errorMiddleware = require("./middleware/error.middleware");
const AuthRouter = require("./router/auth.router");
const ImageRouter = require("./router/image.router");
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

// mongodb atlas
connectDB()

// image
app.use('/images', express.static('./upload/images')) 

// router
app.use(AuthorRouter)
app.use(BookRouter)
app.use(CitationRouter)
app.use(AuthRouter)
app.use(ImageRouter)

// custom error
app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log("Server is running at ", PORT);
})