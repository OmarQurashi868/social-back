import express from "express";
try {
  require("dotenv").config();
} catch {
  console.log("dotenv skipped");
}
const mongoose = require("mongoose");
const cors = require("cors");
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
app.use("/auth", authRouter);

// Listen
app.listen(process.env.PORT, () =>
  console.log(`Server is listening on port ${process.env.PORT}...`)
);
