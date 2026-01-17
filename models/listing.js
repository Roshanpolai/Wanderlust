const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const  listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1709884735626-63e92727d8b6?q=80&w=1228&auto=format&fit=crop",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1709884735626-63e92727d8b6?q=80&w=1228&auto=format&fit=crop"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
