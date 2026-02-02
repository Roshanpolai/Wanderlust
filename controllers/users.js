const User = require("../models/user.js")

module.exports.renderSignupForm =(req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body.user;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err){
          return next(err);
        }
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
      });   
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/users/signup");
    }
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl;
    res.redirect(redirectUrl || "/listings");
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if(err){
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  })
};