import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const saltRounds = 1;

interface User {
  username: string;
  email: string;
  passwordHash: string;
  passwordConfirm: string;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Provide a username"],
    minlength: [3, "Username must be 3 characters or more"],
    unique: [true, "Username is taken"],
    validate: [validator.isAlphanumeric, "Username must be alphanumerical"],
  },
  email: {
    type: String,
    required: [true, "Provide an email"],
    // lowercase: true,
    unique: [true, "This email is already associated with an account"],
    validate: [validator.isEmail, "Provide a valid email"],
  },
  passwordHash: {
    type: String,
    required: [true, "Provide a password"],
    minlength: [8, "Password must be 8 characters or more"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Provide a password"],
    validate: {
      validator: function (this: User, passwordConfirm: String) {
        return passwordConfirm === this.passwordHash;
      },
      message: "Passwords don't match.",
    },
  },
  creationDate: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  this.passwordHash = await bcrypt.hash(this.passwordHash, saltRounds);
  this.passwordConfirm = undefined;
  next();
});

export default mongoose.model("user", userSchema);
