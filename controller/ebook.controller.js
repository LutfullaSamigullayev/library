const CustomErrorHandler = require("../error/custom-error-handler");
const EBookSchema = require("../schema/elektronic.schema");

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

// const getOneEBookFormat = async (req, res, next) => {
//   try {
//     const { id, format } = req.params;
//     const eBook = await EBookSchema.findById(id).populate({
//       path: "book_info",
//       populate: {
//         path: "author_info",
//       },
//     });
//     if (!eBook) {
//       throw CustomErrorHandler.NotFound("EBook book not found");
//     }
//     const foundFile = eBook.files.find(
//       (f) => f.format.toLowerCase() === format.toLowerCase()
//     );
//     if (!foundFile) {
//       throw CustomErrorHandler.NotFound(`${format.toUpperCase()} format not found`);
//     }
//     res.status(200).json({
//       message: `EBook book in ${format.toUpperCase()} format`,
//       book_info: eBook.book_info,
//       file: foundFile,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const addEBook = async (req, res, next) => {
  try {

    // -----------------------------------  start    ---------------------------------------

    // bu yerga EBook url va format kelishi kerak
    
    // -----------------------------------  end    ---------------------------------------

    const { bookId } = req.params;
    const foundedBook = await EBookSchema.findById(bookId);
    if (!foundedBook) {
      throw CustomErrorHandler.NotFound("Bunday kitob topilmadi!");
    }

    let eBook = await EBookSchema.findOne({ book_info: bookId });

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
