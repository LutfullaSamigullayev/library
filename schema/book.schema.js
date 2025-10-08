const { Schema, model } = require("mongoose");

const Book = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    img: {
      type: String,
      required: true,
      default: 'https://picsum.photos/200/300'
    },
    genre: {
      type: String,
      required: true,
      enum: [
        "Roman",
        "Qissa",
        "Hikoya",
        "She’r",
        "Doston",
        "Drama",
        "Fantastika",
        "Essye",
        "Tarixiy",
        "Ilmiy-ommabop",
        "Dostonlar to‘plami"
      ],
    },
    publishedYear: {
      type: Number,
      required: true,
      min: 1,
      max: new Date().getFullYear()
    },
    publishedHome: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 100
    },
    page: {
      type: Number,
      required: true,
      min:4,
      max:2000
    },
    desc: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 1000
    },
    author_info: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const BookSchema = model("Book", Book);

module.exports = BookSchema;
