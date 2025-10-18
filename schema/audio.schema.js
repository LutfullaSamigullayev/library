const { Schema, model } = require("mongoose");

const AudioBookPart = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  format: {type: String, enum: ["mp3", "mp4", "ogg", "aac", "mpeg", "wav", "x-wav", "webm", "x-m4a", "flac"], required: true, },
  size: {type: Number, min: 0.1, max: 50}, // mb
  duration: { type: Number, required: true, min: 60, max: 60 * 60 * 30 }, // sekund
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
    total_file: {
      type: Number,
      default: 0,
    },
    total_duration: {
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
