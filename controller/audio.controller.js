const CustomErrorHandler = require("../error/custom-error-handler");
const AudioBookSchema = require("../schema/audio.schema");
const BookSchema = require("../schema/book.schema");
const { uploadAudio, moveAudio, updateAudio, removeAudio, removeEmptyFolders,  } = require("../utils/storage/audioStorage");

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
    const searchResult = await AudioBookSchema.aggregate([
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

const getOneAudio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const audioBook = await AudioBookSchema.findById(id).populate({
      path: "book_info",
      populate: { path: "author_info" },
    });
    if (!audioBook) throw CustomErrorHandler.NotFound("Audio topilmadi!");
    res.status(200).json(audioBook);
  } catch (error) {
    next(error);
  }
};

const addAudio = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { bookId } = req.params;
    const file = req.file;
   
    if (!file) throw CustomErrorHandler.BadRequest("Audio fayl yuborilmadi!");
    const foundedBook = await BookSchema.findById(bookId)
    if (!foundedBook) {
      throw CustomErrorHandler.NotFound("Bunday kitob topilmadi!");
    }
    // 🔍 AudioBook topamiz yoki yaratamiz

    let audioBook = await AudioBookSchema.findOne({
      book_info: bookId,
    }).populate({
      path: "book_info",
      populate: { path: "author_info" },
    });
    if (!audioBook) {
      audioBook = await AudioBookSchema.create({
        book_info: bookId,
        parts: [],
        total_file: 0,
        total_duration: 0,
        total_size: 0,
      });
      
      // yangi yaratilgach yana populate qilish kerak
      audioBook = await AudioBookSchema.findOne({ book_info: bookId }).populate(
        {
          path: "book_info",
          populate: { path: "author_info" },
        }
      );
    }
    if(audioBook.parts.some(item => item.title === title)) throw CustomErrorHandler.BadRequest(`${title} audio nomi mavjud. Boshqa nom kiriting!`)

    // ☁️ Supabase'ga yuklash
    const uploaded = await uploadAudio(
      file.buffer,
      audioBook.book_info.author_info.full_name,
      audioBook.book_info.title,
      title,
      file.originalname
    );

    // 🎧 Yangi part
    const newPart = {
      title,
      url: uploaded.url,
      objectPath: uploaded.objectPath,
      format: uploaded.format,
      size: uploaded.size,
      duration: uploaded.duration,
    };

    // 📦 Bazaga qo‘shish
    audioBook.parts.push(newPart);
    audioBook.total_file = audioBook.parts.length;
    audioBook.total_duration = audioBook.parts.reduce(
      (s, p) => s + p.duration,
      0
    );
    audioBook.total_size = +audioBook.parts
      .reduce((s, p) => s + p.size, 0)
      .toFixed(2);

    await audioBook.save();

    res.status(201).json({
      message: "Audio muvaffaqiyatli yuklandi 🎧",
      data: newPart,
    });
  } catch (error) {
    next(error);
  }
};

const updateAudioPart = async (req, res, next) => {
  try {
    const { bookId, partId } = req.params;
    const { title } = req.body;
    const file = req.file;

    // 📚 Kitobni topamiz
    const audioBook = await AudioBookSchema.findOne({
      book_info: bookId,
    }).populate({
      path: "book_info",
      populate: { path: "author_info" },
    });
    if (!audioBook)
      throw CustomErrorHandler.NotFound("Bu kitob uchun audio topilmadi!");

    if(audioBook.parts.some(item => item.title === title)) throw CustomErrorHandler.BadRequest(`${title} audio nomi mavjud. Boshqa nom kiriting!`)

    const part = audioBook.parts.id(partId);
    if (!part)
      throw CustomErrorHandler.NotFound("Bunday audio qism topilmadi!");

    // 🚫 Agar yangi title berilmagan bo‘lsa va fayl ham yo‘q bo‘lsa
    if (!title && !file)
      throw CustomErrorHandler.BadRequest("Hech qanday o‘zgarish kiritilmadi!");

    // 🎧 Agar faqat nom o‘zgargan bo‘lsa (fayl yo‘q)
    if (title && !file) {
      // 🔁 Agar title eski title bilan bir xil bo‘lsa — e’tibor bermaymiz
      if (title.trim().toLowerCase() === part.title.trim().toLowerCase()) {
        return res.status(200).json({
          message: "Audio nomi o‘zgartirilmadi (eski nom bilan bir xil) 📝",
          data: part,
        });
      }

      // 🗂️ Supabase’dagi fayl nomini ham yangilaymiz
      const moved = await moveAudio(
        part.objectPath,
        audioBook.book_info.author_info.full_name,
        audioBook.book_info.title,
        title
      );

      part.title = title;
      part.url = moved.newUrl;
      part.objectPath = moved.newPath;

      await audioBook.save();

      return res.status(200).json({
        message: "Audio nomi muvaffaqiyatli o‘zgartirildi 📝",
        data: part,
      });
    }

    // 🎧 Agar fayl ham yuborilgan bo‘lsa — yangisini yuklab, eski faylni o‘chiramiz
    if (file) {
      const updated = await updateAudio(
        part.objectPath,
        file.buffer,
        audioBook.book_info.author_info.full_name,
        audioBook.book_info.title,
        title || part.title,
        file.originalname,
        title
      );
      part.title = title || part.title;
      part.url = updated.url;
      part.objectPath = updated.objectPath;
      part.format = updated.format;
      part.size = updated.size;
      part.duration = updated.duration;

      // 📊 Statistikani qayta hisoblaymiz
      audioBook.total_file = audioBook.parts.length;
      audioBook.total_duration = audioBook.parts.reduce(
        (s, p) => s + p.duration,
        0
      );
      audioBook.total_size = +audioBook.parts
        .reduce((s, p) => s + p.size, 0)
        .toFixed(2);

      await audioBook.save();

      return res.status(200).json({
        message: "Audio fayl muvaffaqiyatli yangilandi 🔁",
        data: part,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteOneAudio = async (req, res, next) => {
  try {
    const { bookId, partId } = req.params;

    const audioBook = await AudioBookSchema.findOne({ book_info: bookId });
    if (!audioBook)
      throw CustomErrorHandler.NotFound("Bu kitob uchun audio topilmadi!");

    const part = audioBook.parts.id(partId);
    if (!part)
      throw CustomErrorHandler.NotFound("Bunday audio qism topilmadi!");

    // 🗑️ Supabase'dan o‘chiramiz
    await removeAudio(part.objectPath);

    // 🧩 Bazadan ham o‘chiramiz
    const deletedTitle = part.title;
    part.deleteOne();

    // 📊 Statistikalarni yangilaymiz
    audioBook.total_file = audioBook.parts.length;
    audioBook.total_duration = audioBook.parts.reduce(
      (s, p) => s + p.duration,
      0
    );
    audioBook.total_size = +audioBook.parts
      .reduce((s, p) => s + p.size, 0)
      .toFixed(2);

    await audioBook.save();

    if(!audioBook.total_file) {
      await AudioBookSchema.deleteOne({ book_info: bookId });
    }

    res.status(200).json({
      message: `Audio qism (“${deletedTitle}”) o‘chirildi 🗑️`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAudioBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const audioBook = await AudioBookSchema.findOne({ book_info: bookId });
    if (!audioBook) throw CustomErrorHandler.NotFound("Audio kitob topilmadi!");

    // ☁️ Supabase’dan barcha fayllarni parallel o‘chiramiz
    const deleteResults = await Promise.allSettled(
      audioBook.parts.map((part) => removeAudio(part.objectPath))
    );

    const failedDeletes = deleteResults.filter((r) => r.status === "rejected");

    // 🗃️ Bazadan butun audio kitobni o‘chiramiz
    await AudioBookSchema.deleteOne({ book_info: bookId });

    // 🧹 Endi bo‘sh papkalarni tozalaymiz
    const firstPart = audioBook.parts[0];
    const pathsToCheck = [
      firstPart.objectPath.split("/").slice(0, 2).join("/"), // muallif/kitob
      firstPart.objectPath.split("/")[0], // faqat muallif
    ];

    await removeEmptyFolders(pathsToCheck);

    if (failedDeletes.length > 0) {
      return res.status(207).json({
        message: `Audio kitob o‘chirildi 📚, ammo ${failedDeletes.length} ta fayl Supabase’dan o‘chirilmadi ⚠️`,
      });
    }
    // bu yerda bosh papkalrni o'chirish funksiyasi bo'ladi
    res.status(200).json({ message: "Audio kitob to‘liq o‘chirildi 📚" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAudios,
  searchAudio,
  getOneAudio,
  addAudio,
  updateAudioPart,
  deleteOneAudio,
  deleteAudioBook,
};
