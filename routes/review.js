const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review");
const Listing = require("../models/listing.js")
const { isLoggedIn, validateReview } = require("../middleware.js");


//post Review route
router.post("/", validateReview, wrapAsync (async(req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success","New Reviwe Added");
  res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;