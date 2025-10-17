const CustomErrorHandler = require("../error/custom-error-handler");
const ElectronicBookSchema = require("../schema/elektronic.schema");

const getAllElectronics = async (req, res, next) => {
  try {
    const electronics = await ElectronicBookSchema.find().populate({
      path: "book_info",
      populate: { path: "author_info" },
    });
    res.status(200).json(electronics);
  } catch (error) {
    next(error);
  }
};

const searchElectronic = async (req, res, next) => {
  try {
    const { title } = req.query;
    const searchResult = await ElectronicBookSchema.aggregate([
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

const getOneElectronic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const electronicBook = await ElectronicBookSchema.findById(id).populate({
      path: "book_info",
      populate: {
        path: "author_info",
      },
    });
    if (!electronicBook) {
      throw CustomErrorHandler.NotFound("Electronic not found");
    }
    res.status(200).json(electronicBook);
  } catch (error) {
    next(error);
  }
};

const getOneElectronicFormat = async (req, res, next) => {
  try {
    const { id, format } = req.params;
    const electronicBook = await ElectronicBookSchema.findById(id).populate({
      path: "book_info",
      populate: {
        path: "author_info",
      },
    });
    if (!electronicBook) {
      throw CustomErrorHandler.NotFound("Electronic book not found");
    }
    const foundFile = electronicBook.files.find(
      (f) => f.format.toLowerCase() === format.toLowerCase()
    );
    if (!foundFile) {
      throw CustomErrorHandler.NotFound(`${format.toUpperCase()} format not found`);
    }
    res.status(200).json({
      message: `Electronic book in ${format.toUpperCase()} format`,
      book_info: electronicBook.book_info,
      file: foundFile,
    });
  } catch (error) {
    next(error);
  }
};

const addElectronic = async (req, res, next) => {
  try {

    // -----------------------------------  start    ---------------------------------------

    // bu yerga Electronic url va format kelishi kerak
    
    // -----------------------------------  end    ---------------------------------------

    const { bookId } = req.params;
    const foundedBook = await BookSchema.findById(bookId);
    if (!foundedBook) {
      throw CustomErrorHandler.NotFound("Bunday kitob topilmadi!");
    }

    let electronicBook = await ElectronicBookSchema.findOne({ book_info: bookId });

    // electronic .create qo'shilishi kerak
    res.status(201).json({
      message: "Yangi Electronic bo‘lim qo‘shildi!",
      data: ElectronicBook,
    });
  } catch (error) {
    next(error);
  }
};

const updateElectronic = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

const deleteElectronic = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

const clearElectronicFiles = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

const deleteElectronicBook = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllElectronics,
  searchElectronic,
  getOneElectronic,
  addElectronic,
  updateElectronic,
  deleteElectronic,
  clearElectronicFiles,
  deleteElectronicBook
};
