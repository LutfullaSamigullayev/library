const CustomErrorHandler = require("../error/custom-error-handler")
const CitationSchema = require("../schema/citation.schema")

const getAllCitations = async (req, res, next) => {
    try {
        const citations = await CitationSchema.find().populate("book_id")
        res.status(200).json(citations)
    } catch (error) {
        next(error)
    }
}

const addCitation = async (req, res, next) => {
    try {
        const {text, book_id } = req.body
        await CitationSchema.create({text, book_id})
        res.status(201).json({message: "Added new citation"})
    } catch (error) {
        next(error)
    }
}

const updateCitation = async (req, res, next) => {
    try {
        const {text, book_id} = req.body
        const {id} = req.params
        const foundedCitation = await CitationSchema.findById(id)
        if(!foundedCitation) {
            throw CustomErrorHandler.NotFound("Citation not found")
        }
        await CitationSchema.findByIdAndUpdate(id, {text, book_id})
        res.status(201).json({message: "Update citation"})
    } catch (error) {
        next(error)
    }
}

const deleteCitation = async (req, res, next) => {
    try {
        const {id} = req.params
        const foundedCitation = await CitationSchema.findById(id)
        if(!foundedCitation) {
            throw CustomErrorHandler.NotFound("Citation not found")
        }
        await CitationSchema.findByIdAndDelete(id)
        res.status(201).json({message: "Delete citation"})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllCitations,
    addCitation,
    updateCitation,
    deleteCitation
}