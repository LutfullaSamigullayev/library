const { Schema, model } = require("mongoose");

const PaperBook = new Schema(
  {
    book_info: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    weight_gram: { type: Number, min: 10, max: 5000, required: true, },
    count: {
      type: Number,
      min: 0,
      max: 1000,
      default: 0,
      required: true,
    },
    // available: { type: Boolean, default: true },
    // isbn: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const PaperBookSchema = model("PaperBook", PaperBook);

module.exports = PaperBookSchema;
