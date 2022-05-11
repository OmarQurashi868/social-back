import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title cannot be empty"],
    minlength: [3, "Title must be 3 characters or more"],
  },
  content: {
    type: String,
    required: [true, "Content cannot be empty"],
    minlength: [5, "Content must be 5 characters or more"],
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  creatorId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Post", postSchema);
