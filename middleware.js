const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schemaValidation.js");


// Authentication middleware
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/users/login");
  }
  next();
}; 

// Save redirect URL middleware
module.exports.saveRedirectUrl = async (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Authorization middleware
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

// Listing validation middleware

// module.exports.validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate({ listing: req.body.listing });
//   if (error) {
//     const errMsg = error.details.map(el => el.message).join(",");
//     return next(new ExpressError(400, errMsg));
//   }
//   next();
// };

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.log(error);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};



// Review validation middleware
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg); //400 Bad-request
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}