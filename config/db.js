const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "userDB",
    });

    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.log(`Error ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
