const { Schema, model } = require("mongoose");

const EBookFile = new Schema({
  url: { type: String, required: true },
  format: { type: String, enum: ["pdf", "epub", "docx"], required: true },
  size_mb: { type: Number, min: 0.1, max: 500, required: true },
});

const ElectronicBook  = new Schema(
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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const ElectronicBookSchema = model("ElectronicBook", ElectronicBook);

module.exports = ElectronicBookSchema;
