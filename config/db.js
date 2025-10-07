const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to db"))
      .catch((error) => console.log(error.message));
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = connectDB