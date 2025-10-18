const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db");
const AuthorRouter = require("./router/author.router");
const BookRouter = require("./router/book.router");
const CitationRouter = require("./router/citation.router");
const errorMiddleware = require("./middleware/error.middleware");
const AuthRouter = require("./router/auth.router");
const FileRouter = require("./router/file.router");
const cookieParser = require("cookie-parser");
const ProfileRouter = require("./router/profile.router");
const PaperRouter = require("./router/paper.router");
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")
require("dotenv").config()


const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// YAML faylni yuklash
const swaggerDocument = YAML.load("./docs/swagger.yaml");

// Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// mongodb atlas
connectDB()

// image
app.use('/files', express.static('./upload/files')) 

// router
app.use(AuthorRouter)
app.use(BookRouter)
app.use(CitationRouter)
app.use(AuthRouter)
app.use(FileRouter)
app.use(ProfileRouter)
app.use(PaperRouter)

// custom error
app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log("Server is running at ", PORT);
})