const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

// Routes
const listings = require("./routes/listing.js");
const reviews  = require("./routes/review.js");

// MongoDB URL
const MONGO_URL = "mongodb://127.0.0.1:27017/test";



// MongoDB Connection
main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


// View Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


// Basic Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});


// App Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


// 404 Handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// Global Error Handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


// Server
app.listen(8000, () => {
  console.log("Server listening on port 8000");
});
