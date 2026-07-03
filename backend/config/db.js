const mongoose = require("mongoose");

const getMongoUri = () =>
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL;

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error(
      "MongoDB URI missing. Set MONGO_URI (or MONGODB_URI) in backend/.env"
    );
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB Connected");
};

module.exports = connectDB;
