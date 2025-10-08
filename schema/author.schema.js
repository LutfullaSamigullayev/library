const {Schema, model} = require("mongoose")

const Author = new Schema({
    full_name: {
        type: String,
        required: true,
        match: /^[a-zA-Z\s]+$/,
        minLength: 3,
        maxLength: 50,
        unique: true,
        trim: true,
    },
    birth_date: {
        type: Date,
        required: true,
        min: [new Date("0001-01-01T00:00:00.000Z"), "Sana juda eski!"],
        validate: {
          validator: function (value) {
            // Max Hozirgi sanadan 5 yil oldin
            const fiveYearsAgo = new Date();
            fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
            return value <= fiveYearsAgo;
          },
          message: "Tug‘ilgan sana maximum hozirgi sanadan 5 yil oldin bo‘lishi kerak!"
        }
    },
    death_date: {
        type: Date,
        required: true,
        validate: {
          validator: function (value) {
            if (this.birth_date && value <= this.birth_date) {
              return false; 
            }
            return value <= new Date();
          },
          message: "O‘lim sanasi tug‘ilgan sanadan keyin va hozirgi sanadan oldin bo‘lishi kerak!"
        }
    },
    img: {
        type: String,
        required: true,
        default: 'https://picsum.photos/200/300'
    },
    bio: {
        type: String,
        required: true,
        trim: true,
        minLength: 20,
        maxLength: 1000,
    },
    creativity: {
        type: String,
        required: true,
        trim: true,
        minLength: 10,
        maxLength: 500,
    },
    region: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    period: {
        type: String,
        required: true,
        enum: {
             values : ["Temuriylar davri", "Jadid adabiyoti", "Sovet davri", "Mustaqillik davri"],
            message: "Mavjud davrlar: Temuriylar davri, Jadid adabiyoti, Sovet davri, Mustaqillik davri"
        } 
    }
}, {
    versionKey: false,
    timestamps: true
})

const AuthorSchema = model("Author", Author)

module.exports = AuthorSchema