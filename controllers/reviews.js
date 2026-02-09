const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");

  //Owner cannot review
  if (listing.owner.equals(req.user._id)) {
    req.flash("error", "Owner cannot review their own listing");
    return res.redirect(`/listings/${listing._id}`);
  }

  //Prevent multiple reviews by same user
  const alreadyReviewed = listing.reviews.some(review =>
    review.author.equals(req.user._id)
  );

  if (alreadyReviewed) {
    req.flash("error", "You have already reviewed this listing");
    return res.redirect(`/listings/${listing._id}`);
  }

  //Create review
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Added");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req,res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
}