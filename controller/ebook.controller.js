const CustomErrorHandler = require("../error/custom-error-handler");
const BookSchema = require("../schema/book.schema");
const EBookSchema = require("../schema/ebook.schema");

const getAllEBooks = async (req, res, next) => {
  try {
    const eBooks = await EBookSchema.find().populate({
      path: "book_info",
      populate: { path: "author_info" },
    });
    res.status(200).json(eBooks);
  } catch (error) {
    next(error);
  }
};

const searchEBook = async (req, res, next) => {
  try {
    const { title } = req.query;
    const searchResult = await EBookSchema.aggregate([
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

const getOneEBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const eBook = await EBookSchema.findById(id).populate({
      path: "book_info",
      populate: {
        path: "author_info",
      },
    });
    if (!eBook) {
      throw CustomErrorHandler.NotFound("EBook not found");
    }
    res.status(200).json(eBook);
  } catch (error) {
    next(error);
  }
};

const addEBook = async (req, res, next) => {
  try {
    const {bookId} = req.params
    const file = req.file

    if (!file) throw CustomErrorHandler.BadRequest("Elektron kitob yuborilmadi!");
    const foundedBook = await BookSchema.findById(bookId)
    if (!foundedBook) {
      throw CustomErrorHandler.NotFound("Bunday kitob topilmadi!");
    }

    let eBook = await EBookSchema.findOne({ book_info: bookId }).populate({
      path: "book_info",
      populate: { path: "author_info" },
    });
    if(!eBook) {
      eBook = await EBookSchema.create({
        book_info: bookId,

      })
    }

    if (!foundedBook) {
      throw CustomErrorHandler.NotFound("Bunday kitob topilmadi!");
    }

    // eBook .create qo'shilishi kerak
    res.status(201).json({
      message: "Yangi EBook bo‘lim qo‘shildi!",
      data: EBook,
    });
  } catch (error) {
    next(error);
  }
};

const updateEBook = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

const deleteOneEBook = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

const deleteEBook = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllEBooks,
  searchEBook,
  getOneEBook,
  addEBook,
  updateEBook,
  deleteOneEBook,
  deleteEBook
};
