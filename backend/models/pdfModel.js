import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    name: String,
    path: String,
    contentType: String,
    data: Buffer,
    base64Data: String,
    user: String,
    comments: [String],
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);

export default PDF;
