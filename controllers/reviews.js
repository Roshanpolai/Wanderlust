const Listing = require("../models/listing");
const Review = require("../models/review");

// CREATE REVIEW
module.exports.createReview = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id).populate({
    path: "reviews",
    select: "author",
  });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!req.user) {
    req.flash("error", "You must be logged in to review");
    return res.redirect(`/listings/${id}`);
  }

  // Owner cannot review
  if (listing.owner.equals(req.user._id)) {
    req.flash("error", "Owner cannot review their own listing");
    return res.redirect(`/listings/${id}`);
  }

  // Prevent multiple reviews
  const alreadyReviewed = listing.reviews.some(
    (review) => review.author.equals(req.user._id)
  );

  if (alreadyReviewed) {
    req.flash("error", "You have already reviewed this listing");
    return res.redirect(`/listings/${id}`);
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New review added");
  res.redirect(`/listings/${id}`);
};

// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  // Only review author can delete
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not allowed to delete this review");
    return res.redirect(`/listings/${id}`);
  }

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};