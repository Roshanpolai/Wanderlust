const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { username, email, password } = req.body.user;
    const newUser = new User({ username, email });
    await User.register(newUser, password);
    req.flash("success", "Welcome to WanderLust!");
    res.redirect("/listings");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/users/signup");
  }
}));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/users/login", 
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);

module.exports = router;
