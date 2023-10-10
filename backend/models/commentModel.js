import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    pdfId: String,
    comments: [String],
    replies: [String],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
