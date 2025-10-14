const { Schema, model } = require("mongoose");

const AudioBookPart = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: Number, required: true, min: 60, max: 60 * 60 * 60 * 30 },
});

const AudioBook = new Schema(
  {
    book_info: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    parts: {
      type: [AudioBookPart],
      default: [],
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const AudioBookSchema = model("AudioBook", AudioBook);

module.exports = AudioBookSchema;
