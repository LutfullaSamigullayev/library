const CustomErrorHandler = require("../error/custom-error-handler");
const AuthSchema = require("../schema/auth.schema");
const bcryptjs = require("bcryptjs");

const getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      throw CustomErrorHandler.UnAuthorized("req.user not found");
    }
    const foundedUser = await AuthSchema.findById(req.user.id);
    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized("Bunday foydalanuvchi mavjud emas");
    }

    res.status(201).json(foundedUser);
  } catch (error) {
    next(error);
  }
};

const editProfile = async (req, res, next) => {
  try {
    const { lastName, firstName, phoneNumber, email } = req.body;
    if (email !== req.user.email) {
      throw CustomErrorHandler.UnAuthorized("Bu email sizniki emas!");
    }
    const foundedUser = await AuthSchema.findOne({ email });
    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized(
        "Bu email bilan foydalanuvchi mavjud emas!"
      );
    }

    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      lastName,
      firstName,
      phoneNumber,
    });
    res.status(201).json({ message: "edit seccess" });
  } catch (error) {
    next(error);
  }
};

const editPassword = async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (email !== req.user.email) {
      throw CustomErrorHandler.UnAuthorized("Bu email sizniki emas!");
    }
    const foundedUser = await AuthSchema.findById(req.user.id);
    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized("Bunday foydalanuvchi mavjud emas");
    }
    const isPasswordCorrect = await bcryptjs.compare(
      currentPassword,
      foundedUser.password
    );
    if (!isPasswordCorrect) {
      throw CustomErrorHandler.UnAuthorized("Parol noto‘g‘ri!");
    }
    if (currentPassword === newPassword) {
      throw CustomErrorHandler.BadRequest("eski parol va yangi parol bir xil");
    }

    const hashPassword = await bcryptjs.hash(newPassword, 12);

    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      password: hashPassword,
    });

    res.status(201).json({
      message: "Parolingiz muvaffaqiyatli yangilandi!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  editProfile,
  editPassword
};
