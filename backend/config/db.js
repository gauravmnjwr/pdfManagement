import mongoose from "mongoose";

const connectDB = async (uri) => {
  mongoose.connect(uri, {
    // dbName: "pdfManagement",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
};

export default connectDB;
