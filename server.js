const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs");

// router imports
const errorMiddleware = require("./middleware/error.middleware");
const AuthorRouter = require("./router/author.router");
const BookRouter = require("./router/book.router");
const CitationRouter = require("./router/citation.router");
const AuthRouter = require("./router/auth.router");
const ProfileRouter = require("./router/profile.router");
const PaperRouter = require("./router/paper.router");
const AudioRouter = require("./router/audio.router");
const EBookRouter = require("./router/ebook.router");

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
app.use(ProfileRouter)
app.use(PaperRouter)
app.use(AudioRouter)
app.use(EBookRouter)

// custom error
app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log("Server is running at ", PORT);
})