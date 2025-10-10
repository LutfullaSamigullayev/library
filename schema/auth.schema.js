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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const AuthSchema = model("Auth", Auth);

module.exports = AuthSchema;
