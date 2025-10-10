const addImage = async (req, res, next) => {
  try {
    const file = req.file;
    res.status(201).json({
      message: "Added new images",
      imgUrl: `http://localhost:4001/images/${file.filename}`,
    });
  } catch (error) {
    next(error)
  }
};

module.exports = {
  addImage,
};
