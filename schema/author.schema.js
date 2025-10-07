const {Schema, model} = require("mongoose")

const Author = new Schema({
    full_name: {
        type: String,
        required: true
    },
    birth_date: {
        type: String,
        required: true
    },
    death_date: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    creativity: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

const AuthorSchema = model("Author", Author)

module.exports = AuthorSchema