const { Schema, model } = require("mongoose");

const Auth = new Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minLength: 5,
      maxLength: 50,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    otp: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpTime: {
      type: Number,
      default: null,
    },
    lastName: {
      type: String,
      required: false,
      minLength: 1,
      maxLength: 20,
      trim: true,
      default: null,
    },
    firstName: {
      type: String,
      required: false,
      minLength: 1,
      maxLength: 20,
      trim: true,
      default: null,
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      default: null,
      minLength: 9,
      maxLength: 15,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const AuthSchema = model("Auth", Auth);

module.exports = AuthSchema;
