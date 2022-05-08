import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export const saltRounds = 12;

interface User {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

// Add user sessions for session verification

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username cannot be empty"],
    minlength: [3, "Username must be 3 characters or more"],
    unique: [true, "Username is taken"],
    validate: [validator.isAlphanumeric, "Username must be alphanumerical"],
  },
  email: {
    type: String,
    required: [true, "Email cannot be empty"],
    // lowercase: true,
    unique: [true, "This email is already associated with an account"],
    validate: [validator.isEmail, "Provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be empty"],
    minlength: [8, "Password must be 8 characters or more"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Passwords do not match"],
    validate: {
      validator: function (this: User, passwordConfirm: String) {
        return passwordConfirm === this.password;
      },
      message: "Passwords don't match",
    },
    select: false,
  },
  creationDate: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, saltRounds);
  this.passwordConfirm = undefined;
  next();
});

export default mongoose.model("user", userSchema);
