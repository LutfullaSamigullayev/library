const addfile = async (req, res, next) => {
  try {
    const file = req.file;
    res.status(201).json({
      message: "Added new file",
      imgUrl: `http://localhost:4001/files/${file.filename}`,
    });
  } catch (error) {
    next(error)
  }
};

module.exports = {
  addfile,
};
