import express from "express";
const app = express();
import mongoose from "mongoose";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";

import eventRoutes from "./routes/event.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected To DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

// Routes
app.use("/", eventRoutes);

// Middleware for Error
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("events/error.ejs", { message });
});

app.listen("5050", () => {
  console.log("App is listening to port: 5050");
});
