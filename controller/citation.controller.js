const CitationSchema = require("../schema/citation.schema")

const getAllCitations = async (req, res) => {
    try {
        const citations = await CitationSchema.find().populate("book_id")
        res.status(200).json(citations)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const addCitation = async (req, res) => {
    try {
        const {text, book_id } = req.body
        await CitationSchema.create({text, book_id})
        res.status(201).json({message: "Added new citation"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const updateCitation = async (req, res) => {
    try {
        const {text, book_id} = req.body
        const {id} = req.params
        const foundedCitation = await CitationSchema.findById(id)
        if(!foundedCitation) {
            res.status(404).json({message: "Citation not found"})
        }
        await CitationSchema.findByIdAndUpdate(id, {text, book_id})
        res.status(201).json({message: "Update citation"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const deleteCitation = async (req, res) => {
    try {
        const {id} = req.params
        const foundedCitation = await CitationSchema.findById(id)
        if(!foundedCitation) {
            res.status(404).json({message: "Citation not found"})
        }
        await CitationSchema.findByIdAndDelete(id)
        res.status(201).json({message: "Delete citation"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    getAllCitations,
    addCitation,
    updateCitation,
    deleteCitation
}