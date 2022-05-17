import mongoose from "mongoose";
import { nanoid } from "nanoid";

export const saltRounds = 12;

const sessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  userId: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
    index: {
      expires: "15d",
    },
  },
});

export default mongoose.model("session", sessionSchema);