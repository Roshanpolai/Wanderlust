if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("express-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Routes
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const usersRoute = require("./routes/user.js");

// DB URL
const dburl = process.env.ATLASDB_URL;
app.locals.MAP_TOKEN = process.env.MAP_TOKEN;
// DB Connection

main()
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}
// View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Basic Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session Store
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: { 
    secret: process.env.SECRET || "defaultsecretkey",
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

// Session
const sessionOptions = {
  store,
  secret: process.env.SECRET || "defaultsecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// App routes app.use("/", usersRoute);
app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/users", usersRoute);
const bookingRoutes = require("./routes/bookings");
app.use("/bookings", bookingRoutes);

// 404
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error handler
// app.use((err, req, res, next) => {
//   console.log("ERROR:", err);

//   let { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).render("error.ejs", { message });
// });

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some Error Occured!" } = err;
  res.status(statusCode).render("listings/error", { message });
});

// Server
app.listen(8000, () => {
  console.log("Server listening on port 8000");
});

app.use((req, res, next) => {
  res.locals.MAP_TOKEN = process.env.MAP_TOKEN;
  next();
});
