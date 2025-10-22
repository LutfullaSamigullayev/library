const CustomErrorHandler = require("../error/custom-error-handler");
const BookSchema = require("../schema/book.schema");
const EBookSchema = require("../schema/ebook.schema");
const path = require("path");
const { uploadEbook, updateEbook, removeEbook } = require("../utils/storage/ebookStorage");

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
    const { bookId } = req.params;
    const file = req.file;
    if (!file) throw CustomErrorHandler.BadRequest("Elektron kitob yuborilmadi!");
    const fileFormat = path.extname(req.file.originalname).slice(1);
    const foundedBook = await BookSchema.findById(bookId);
    if (!foundedBook) {
      throw CustomErrorHandler.NotFound("Bunday kitob topilmadi!");
    }
    let eBook = await EBookSchema.findOne({ book_info: bookId }).populate({
      path: "book_info",
      populate: { path: "author_info" },
    });
    if (!eBook) {
      eBook = await EBookSchema.create({
        book_info: bookId,
        files: [],
        total_file: 0,
        total_format: [],
        total_size: 0,
      });
      eBook = await EBookSchema.findOne({ book_info: bookId }).populate({
        path: "book_info",
        populate: { path: "author_info" },
      });
    }

    if (eBook.files.length && eBook.files.some(e => e.format === fileFormat)) throw CustomErrorHandler.BadRequest(
        `bu ${fileFormat} formatdagi kitob mavjud.`
      );

    const upload = await uploadEbook(
      file.buffer,
      eBook.book_info.author_info.full_name,
      eBook.book_info.title,
      file.originalname
    );
    const newFile = {
      title: eBook.book_info.title,
      url: upload.url,
      objectPath: upload.objectPath,
      format: upload.format,
      size_mb: upload.size,
    };
    eBook.files.push(newFile);
    eBook.total_file = eBook.files.length;
    eBook.total_format = eBook.files.map((item) => item.format);
    eBook.total_size = +eBook.files
      .reduce((s, p) => s + p.size_mb, 0)
      .toFixed(2);
    await eBook.save();
    res.status(201).json({
      message: "Yangi elektron kitob qo‘shildi!",
      data: newFile,
    });
  } catch (error) {
    next(error);
  }
};

const updateEBookFile = async (req, res, next) => {
  try {
    const { bookId, id } = req.params;
    const file = req.file
    if (!file) throw CustomErrorHandler.BadRequest("Elektron kitob yuborilmadi!");
    const eBook = await EBookSchema.findOne({ book_info: bookId }).populate(
      {
        path: "book_info",
        populate: { path: "author_info" },
      }
    );
    if (!eBook) {
      throw CustomErrorHandler.NotFound("Bunday elektron kitob topilmadi!");
    }
    
    const ebookFile = eBook.files.id(id);
    if (!ebookFile)
      throw CustomErrorHandler.NotFound("Bunday fayl topilmadi!");
    if (ebookFile.format !== path.extname(req.file.originalname).slice(1)) throw CustomErrorHandler.BadRequest(
      `kiritilgan fayl ${ebookFile.format} formatdagi mos emas`
    );
    const updated = await updateEbook(
      ebookFile.objectPath,
      file.buffer,
      eBook.book_info.author_info.full_name,
      eBook.book_info.title,
      file.originalname
    );
    ebookFile.url = updated.url;
    ebookFile.format = updated.format;
    ebookFile.size_mb = updated.size;
    ebookFile.title = eBook.book_info.title;
    ebookFile.objectPath = updated.objectPath;

    // 📊 Statistikani qayta hisoblaymiz
    eBook.total_file = eBook.files.length;
    eBook.total_format = eBook.files.map((item) => item.format);
    eBook.total_size = +eBook.files
      .reduce((s, p) => s + p.size_mb, 0)
      .toFixed(2);

    await eBook.save();

    res.status(200).json({
      message: "E-book fayli muvaffaqiyatli yangilandi!",
      data: ebookFile,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOneEBook = async (req, res, next) => {
  try {
    const { bookId, id } = req.params;

    const eBook = await EBookSchema.findOne({ book_info: bookId });
    if (!eBook)
      throw CustomErrorHandler.NotFound("Bu kitob electron fayl topilmadi!");

    const file = eBook.files.id(id);
    if (!file)
      throw CustomErrorHandler.NotFound("Bunday fayl topilmadi!");

    // 🗑️ Supabase'dan o‘chiramiz
    await removeEbook(file.objectPath);

    // 🧩 Bazadan ham o‘chiramiz
    const deletedTitle = `${file.title}.${file.format}`
    file.deleteOne();

    // 📊 Statistikalarni yangilaymiz
    eBook.total_file = eBook.files.length;
    eBook.total_format = eBook.files.map((item) => item.format);
    eBook.total_size = +eBook.files
      .reduce((s, p) => s + p.size_mb, 0)
      .toFixed(2);

    await eBook.save();

    if(!eBook.total_file) {
      await EBookSchema.deleteOne({ book_info: bookId });
    }

    res.status(200).json({
      message: `“${deletedTitle}” fayl o‘chirildi 🗑️`,
    });
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
  updateEBookFile,
  deleteOneEBook,
  deleteEBook,
};
