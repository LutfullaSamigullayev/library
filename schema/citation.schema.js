const { Schema, model } = require("mongoose");

const Citation = new Schema(
  {
    text: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    book_id: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CitationSchema = model("Citation", Citation);

module.exports = CitationSchema;
