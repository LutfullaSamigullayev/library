const CustomErrorHandler = require("../error/custom-error-handler");
const AuthorSchema = require("../schema/author.schema");

const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await AuthorSchema.find();
    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { name } = req.query;
    const search = await AuthorSchema.find({
      full_name: { $regex: name, $options: "i" },
    });
    res.status(201).json(search);
  } catch (error) {
    next(error);
  }
};

const getOneAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundedAuthor = await AuthorSchema.findById(id);
    if (!foundedAuthor) {
      throw CustomErrorHandler.NotFound("Author not found");
    }
    res.status(201).json(foundedAuthor);
  } catch (error) {
    next(error);
  }
};

const addAuthor = async (req, res, next) => {
  try {
    const {
      full_name,
      birth_date,
      death_date,
      img,
      bio,
      creativity,
      region,
      period,
    } = req.body;
    await AuthorSchema.create({
      full_name,
      birth_date,
      death_date,
      img,
      bio,
      creativity,
      region,
      period,
    });
    res.status(201).json({ message: "Added new author" });
  } catch (error) {
    next(error);
  }
};

const updateAuthor = async (req, res, next) => {
  try {
    const {
      full_name,
      birth_date,
      death_date,
      img,
      bio,
      creativity,
      region,
      period,
    } = req.body;
    const { id } = req.params;
    const foundedAuthor = await AuthorSchema.findById(id);
    if (!foundedAuthor) {
      throw CustomErrorHandler.NotFound("Author not found");
    }
    await AuthorSchema.findByIdAndUpdate(id, {
      full_name,
      birth_date,
      death_date,
      img,
      bio,
      creativity,
      region,
      period,
    });
    res.status(201).json({ message: "Update author" });
  } catch (error) {
    next(error);
  }
};

const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundedAuthor = await AuthorSchema.findById(id);
    if (!foundedAuthor) {
      throw CustomErrorHandler.NotFound("Author not found");
    }
    await AuthorSchema.findByIdAndDelete(id);
    res.status(201).json({ message: "Delete author" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAuthors,
  search,
  getOneAuthor,
  addAuthor,
  updateAuthor,
  deleteAuthor,
};
