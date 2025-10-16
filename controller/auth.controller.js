const CustomErrorHandler = require("../error/custom-error-handler");
const AuthSchema = require("../schema/auth.schema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOtp = require("../utils/send-otp");
const { accessToken, refreshToken } = require("../utils/token-generator");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const foundedUsername = await AuthSchema.findOne({ username });
    if (foundedUsername) {
      throw CustomErrorHandler.UnAuthorized(
        "Bu username bilan foydalanuvchi mavjud!"
      );
    }
    const foundedEmail = await AuthSchema.findOne({ email });
    if (foundedEmail) {
      throw CustomErrorHandler.UnAuthorized(
        "Bu email bilan foydalanuvchi mavjud!"
      );
    }
    const randomNum = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    sendOtp(email, randomNum);
    const hashPassword = await bcryptjs.hash(password, 12);
    const time = Date.now() + 120000;
    await AuthSchema.create({
      username,
      email,
      password: hashPassword,
      otp: randomNum,
      otpTime: time,
    });
    res.status(201).json({ message: "Registered" });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const foundedUser = await AuthSchema.findOne({ email });
    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized(
        "Bu email bilan foydalanuvchi ro'yxatdan o'tmagan"
      );
    }
    if (foundedUser.otp !== otp) {
      throw CustomErrorHandler.UnAuthorized("Code xato");
    }
    const now = Date.now();
    if (foundedUser.otpTime < now) {
      throw CustomErrorHandler.UnAuthorized("Code yaroqlik muddati o'tgan");
    }
    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      isVerified: true,
      otp: null,
      otpTime: null,
    });

    const payload = {
      _id: foundedUser._id,
      email: foundedUser.email,
      role: foundedUser.role,
    };
    const access = accessToken(payload);
    const refresh = refreshToken(payload);

    res.cookie("AccessToken", access, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("RefreshToken", refresh, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 24 * 15,
    });

    res.status(201).json({
      message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi!",
      access,
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
      throw CustomErrorHandler.UnAuthorized("Bunday foydalanuvchi topilmadi!");
    }
    if (!foundedUser.isVerified) {
      throw CustomErrorHandler.UnAuthorized("Foydalanuvchi tasdiqlanmagan");
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
    const access = accessToken(payload);
    const refresh = refreshToken(payload);

    res.cookie("AccessToken", access, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("RefreshToken", refresh, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 24 * 15,
    });

    res.status(200).json({
      message: "Tizimga muvaffaqiyatli kirildi!",
      access,
    });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const foundedUser = await AuthSchema.findOne({ email });
    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized(
        "Bu email bilan foydalanuvchi mavjud emas!"
      );
    }
    const randomNum = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    sendOtp(email, randomNum);
    const time = Date.now() + 120000;
    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      otp: randomNum,
      otpTime: time,
    });
    res
      .status(201)
      .json({ message: "Tasdiqlash kodi emailingizga yuborildi!" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, new_password } = req.body;

    const foundedUser = await AuthSchema.findOne({ email });
    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized(
        "Bu email bilan foydalanuvchi ro'yxatdan o'tmagan"
      );
    }

    if (foundedUser.otp !== otp) {
      throw CustomErrorHandler.UnAuthorized("Code xato");
    }
    const now = Date.now();
    if (foundedUser.otpTime < now) {
      throw CustomErrorHandler.UnAuthorized("Code yaroqlik muddati o'tgan");
    }

    const hashPassword = await bcryptjs.hash(new_password, 12);

    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      password: hashPassword,
      otp: null,
      otpTime: null,
    });

    const payload = {
      _id: foundedUser._id,
      email: foundedUser.email,
      role: foundedUser.role,
    };
    const access = accessToken(payload);
    const refresh = refreshToken(payload);

    res.cookie("AccessToken", access, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("RefreshToken", refresh, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 24 * 15,
    });

    res.status(201).json({
      message: "Parolingiz muvaffaqiyatli yangilandi!",
      access,
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

const refreshToken = async (req, res, next) => {
  try {
    if(!req.user) {
      throw CustomErrorHandler.UnAuthorized("req.user not found")
    }
    const payload = {
      _id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    };
    const access = accessToken(payload);
    res.cookie("AccessToken", access, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    next();
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("AccessToken");
    res.clearCookie("RefreshToken");

    res.status(200).json({
      message: "Logout",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verify,
  login,
  forgetPassword,
  resetPassword,
  toAdmin,
  refreshToken,
  logout,
};
