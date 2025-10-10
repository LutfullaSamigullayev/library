const CustomErrorHandler = require("../error/custom-error-handler");
const AuthSchema = require("../schema/auth.schema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await AuthSchema.findOne({ email });
    if (existingUser) {
      throw CustomErrorHandler.BadRequest(
        "Bu email bilan foydalanuvchi mavjud!"
      );
    }
    const hashPassword = await bcryptjs.hash(password, 12);
    const newUser = await AuthSchema.create({
      username,
      email,
      password: hashPassword,
      role: "user",
    });
    const payload = {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "5d",
    });
    res.status(201).json({
      message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi!",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const foundedUser = await AuthSchema.findOne({ email });
    if (!foundedUser) {
      throw CustomErrorHandler.NotFound("Bunday foydalanuvchi topilmadi!");
    }
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      foundedUser.password
    );
    if (!isPasswordCorrect) {
      throw CustomErrorHandler.UnAuthorized("Parol noto‘g‘ri!");
    }
    const payload = {
      _id: foundedUser._id,
      email: foundedUser.email,
      role: foundedUser.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "5d",
    });
    res.status(200).json({
      message: "Tizimga muvaffaqiyatli kirildi!",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const toAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const foundedUser = await AuthSchema.findById(id);
    if (!foundedUser) {
      throw CustomErrorHandler.NotFound("Bunday foydalanuvchi topilmadi!");
    }
    if (role === "super_admin") {
      await AuthSchema.findByIdAndUpdate(id, {
        role: "admin",
      });
      return res.status(201).json({ message: "Update user" });
    } else {
      throw CustomErrorHandler.UnAuthorized("Siz Super Admin emassiz");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  toAdmin,
};
