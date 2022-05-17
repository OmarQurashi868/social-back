import express from "express";
try {
  require("dotenv").config();
} catch {
  console.log("dotenv skipped");
}
// import mongoose from "mongoose";
const mongoose = require("mongoose");
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

// Connect database
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error: string) => console.error(error));
db.once("open", () => console.log("Database connected..."));

// Add routes
import authRouter from "./routes/auth";
import postRouter from "./routes/posts";
app.use("/auth", authRouter);
app.use("/posts", postRouter)

// Listen
app.listen(process.env.PORT, () =>
  console.log(`Server is listening on port ${process.env.PORT}...`)
);
