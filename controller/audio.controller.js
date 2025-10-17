const CustomErrorHandler = require("../error/custom-error-handler");
const AudioBookSchema = require("../schema/audio.schema");

const getAllAudios = async (req, res, next) => {
  try {
    const audios = await AudioBookSchema.find().populate("book_info");
    res.status(200).json(audios);
  } catch (error) {
    next(error);
  }
};

const searchAudio = async (req, res, next) => {
  try {
    const { title } = req.query;
    const searchResult = await AudioBookSchema.find({
      "parts.title": { $regex: title, $options: "i" },
    }).populate({
      path: "book_info",
      populate: {
        path: "author_info",
      },
    });
    res.status(200).json(searchResult);
  } catch (error) {
    next(error);
  }
};

const getOneAudio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const audioBook = await AudioBookSchema.findOne({
      "parts._id": id,
    }).populate({
      path: "book_info",
      populate: { path: "author_info" },
    });

    if (!audioBook) {
      throw CustomErrorHandler.NotFound("Audio not found");
    }
    const audio = audioBook.parts.find((p) => p._id.toString() === id);
    res.status(200).json({
      book: audioBook.book_info,
      audio,
    });
  } catch (error) {
    next(error);
  }
};

const addAudio = async (req, res, next) => {
  try {

    // -----------------------------------  start    ---------------------------------------

    // bu yerga audio url va duration(vaqti kelishi kerak)
    
    // -----------------------------------  end    ---------------------------------------

    const { bookId } = req.params;
    const { title } = req.body;

    const foundedBook = await BookSchema.findById(bookId);
    if (!foundedBook) {
      throw CustomErrorHandler.NotFound("Bunday kitob topilmadi!");
    }

    let audioBook = await AudioBookSchema.findOne({ book_info: bookId });

    if (!audioBook) {
      audioBook = await AudioBookSchema.create({
        book_info: bookId,
        parts: [{ title, url, duration }], //  url, duration keyinchalik qo'shiladi.
        totalFile: 1,
        totalDuration: duration,
      });

      return res.status(201).json({
        message: "Yangi audio kitob yaratildi va birinchi qism qo‘shildi.",
        data: audioBook,
      });
    }

    audioBook.parts.push({ title, url, duration }); //  url, duration keyinchalik qo'shiladi.
    audioBook.total_file = audioBook.parts.length;
    audioBook.total_duration = audioBook.parts.reduce((sum, p) => sum + p.duration, 0);

    await audioBook.save();
    
    res.status(201).json({
      message: "Yangi audio bo‘lim qo‘shildi!",
      data: audioBook,
    });
  } catch (error) {
    next(error);
  }
};

const updateAudio = async (req, res, next) => {
  try {
    
    // -----------------------------------  start    ---------------------------------------

    // bu yerga audio url va duration(vaqti kelishi kerak)
    
    // -----------------------------------  end    ---------------------------------------

    const { bookId, partId } = req.params;
    const { title } = req.body;

    const audioBook = await AudioBookSchema.findOne({ book_info: bookId });
    if (!audioBook) {
      throw CustomErrorHandler.NotFound("Bu kitob uchun audio topilmadi!");
    }

    const part = audioBook.parts.id(partId);
    if (!part) {
      throw CustomErrorHandler.NotFound("Bunday audio qism topilmadi!");
    }

    if (title) part.title = title;
    if (url) part.url = url; //  url keyinchalik qo'shiladi.
    if (duration) part.duration = duration; //  duration keyinchalik qo'shiladi.

    audioBook.total_duration = audioBook.parts.reduce((sum, p) => sum + p.duration, 0);

    await audioBook.save();

    res.status(200).json({
      message: "Audio yangilandi!",
      data: audioBook,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAudio = async (req, res, next) => {
  try {
    const { bookId, partId } = req.params;

    const audioBook = await AudioBookSchema.findOne({ book_info: bookId });
    if (!audioBook) throw CustomErrorHandler.NotFound("Bu kitob uchun audio topilmadi!");

    const part = audioBook.parts.id(partId);
    if (!part) throw CustomErrorHandler.NotFound("Bunday audio qism topilmadi!");

    part.deleteOne();

    audioBook.total_file = audioBook.parts.length;
    audioBook.total_duration = audioBook.parts.reduce((sum, p) => sum + p.duration, 0);

    await audioBook.save();

    res.status(200).json({
      message: "Audio qism o‘chirildi!",
      data: audioBook,
    });
  } catch (error) {
    next(error);
  }
};

const clearAudioParts = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const audioBook = await AudioBookSchema.findOne({ book_info: bookId });
    if (!audioBook) {
      throw CustomErrorHandler.NotFound("Bu kitob uchun audio topilmadi!");
    }

    audioBook.parts = [];
    audioBook.total_file = 0;
    audioBook.total_duration = 0;

    await audioBook.save();

    res.status(200).json({
      message: "Barcha audio qismlar muvaffaqiyatli o‘chirildi!",
      data: audioBook,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAudioBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const deletedAudioBook = await AudioBookSchema.findOneAndDelete({ book_info: bookId });
    if (!deletedAudioBook) {
      throw CustomErrorHandler.NotFound("Bu kitob uchun audio topilmadi!");
    }

    res.status(200).json({
      message: "AudioKitob to‘liq o‘chirildi!",
      data: deletedAudioBook,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllAudios,
  searchAudio,
  getOneAudio,
  addAudio,
  updateAudio,
  deleteAudio,
  clearAudioParts,
  deleteAudioBook
};
