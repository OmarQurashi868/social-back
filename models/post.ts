import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title cannot be empty"],
    minlength: [3, "Title must be 3 characters or more"],
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  content: {
    type: String,
    required: [true, "Content cannot be empty"],
    minlength: [5, "Content must be 5 characters or more"],
    maxlength: [5000, "Content cannot be more than 5000 characters"],
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Post", postSchema);
