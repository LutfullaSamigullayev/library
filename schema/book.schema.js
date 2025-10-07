const { Schema, model } = require("mongoose");

const Book = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    pulishedYear: {
      type: String,
      required: true,
    },
    pulishedHome: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const BookSchema = model("Book", Book);

module.exports = BookSchema;
