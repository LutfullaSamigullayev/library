const CustomErrorHandler = require("../error/custom-error-handler");
const PaperBookSchema = require("../schema/paper.schema");

const getAllPapers = async (req, res, next) => {
  try {
    const papers = await PaperBookSchema.find().populate({
      path: "book_info",
      populate: { path: "author_info" },
    });
    res.status(200).json(papers);
  } catch (error) {
    next(error);
  }
};

const searchPaper = async (req, res, next) => {
  try {
    const { title } = req.query;
    const searchResult = await PaperBookSchema.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book_info",
          foreignField: "_id",
          as: "book_info",
        },
      },
      { $unwind: "$book_info" },
      {
        $match: {
          "book_info.title": { $regex: title, $options: "i" },
        },
      },
    ]);
    res.status(200).json(searchResult);
  } catch (error) {
    next(error);
  }
};

const getOnePaper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paperBook = await PaperBookSchema.findById(id).populate({
      path: "book_info",
      populate: {
        path: "author_info",
      },
    });
    if (!paperBook) {
      throw CustomErrorHandler.NotFound("PaperBook not found");
    }
    res.status(200).json({ paperBook });
  } catch (error) {
    next(error);
  }
};

const addPaper = async (req, res, next) => {
  try {
    const { book_id } = req.params;
    const { weight_gram, count } = req.body;
    const foundedPaper = await PaperBookSchema.findOne({ book_info: book_id });
    if (foundedPaper) {
      throw CustomErrorHandler.BadRequest("Bu kitob uchun qog‘oz nusxa allaqachon mavjud!");
    }
    await PaperBookSchema.create({ book_info: book_id, weight_gram, count });
    res.status(201).json({ message: "Added new paperBook" });
  } catch (error) {
    next(error);
  }
};

const updatePaper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { weight_gram, count } = req.body;
    const foundedPaper = await PaperBookSchema.findById(id)
    if(!foundedPaper) {
      throw CustomErrorHandler.NotFound("Bunday kitob topilmadi.")
    }
    await PaperBookSchema.findByIdAndUpdate(id, {
      weight_gram, count
    })
    res.status(201).json({message: "update paperBook"})
  } catch (error) {
    next(error);
  }
};

const deletePaper = async (req, res, next) => {
  try {
    const {id} = req.params
    const foundedPaper = await PaperBookSchema.findById(id)
    if(!foundedPaper) {
      throw CustomErrorHandler.NotFound("Bunday kitob topilmadi.")
    }
    await PaperBookSchema.findByIdAndDelete(id)
    res.status(200).json({
      message: "deleted paper book",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPapers,
  searchPaper,
  getOnePaper,
  addPaper,
  updatePaper,
  deletePaper,
};
