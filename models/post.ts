import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Username cannot be empty"],
    minlength: [3, "Username must be 3 characters or more"],
    default: "New post"
  },
  content: {
      type: String,
  },
  creationDate: {
      type: Date,
      default: Date.now
  },
  creatorId: {
      type: String,
      required: true,
  },
});

export default mongoose.model("Post", postSchema);
