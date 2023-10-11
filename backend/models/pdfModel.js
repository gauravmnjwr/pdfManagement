import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    name: String,
    contentType: String,
    base64Data: String,
    user: String,
    comments: [String],
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);

export default PDF;
