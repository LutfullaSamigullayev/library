const { Schema, model } = require("mongoose");

const EBookFile = new Schema({
  title: {type: String, required: true, minLength: 3, maxLength: 50},
  url: { type: String, required: true },
  format: { type: String, enum: ["pdf", "epub", "docx", "doc", "mobi", "txt"], required: true },
  size_mb: { type: Number, min: 0.1, max: 500, required: true },
});

const EBook  = new Schema(
  {
    book_info: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    files: {
      type: [EBookFile],
      default: [],
    },
    total_file: {
      type: Number,
      default: 0,
    },
    total_format: {
      type: [String],
      enum: ["pdf", "epub", "docx", "doc", "mobi", "txt"],
      default: [],
    },
    total_size: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const EBookSchema = model("EBook", EBook);

module.exports = EBookSchema;
