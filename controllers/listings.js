const Listing = require("../models/listing");
const Booking = require("../models/booking");


const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAP_TOKEN,
});

// INDEX
module.exports.index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  const totalListings = await Listing.countDocuments({});
  const listings = await Listing.find({})
    .skip(skip)
    .limit(limit);

  res.render("listings/index", {
    listings,
    currentPage: page,
    totalPages: Math.ceil(totalListings / limit)
  });
};

// SEARCH
module.exports.searchListings = async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  const query = {
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ]
  };

  const totalListings = await Listing.countDocuments(query);
  const listings = await Listing.find(query).skip(skip).limit(limit);

  res.render("listings/index", {
    listings,
    currentPage: page,
    totalPages: Math.ceil(totalListings / limit),
    q
  });
};

// CATEGORY
module.exports.categoryListings = async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  const totalListings = await Listing.countDocuments({ category });
  const listings = await Listing.find({ category }).skip(skip).limit(limit);

  res.render("listings/index", {
    listings,
    currentPage: page,
    totalPages: Math.ceil(totalListings / limit),
    category
  });
};

// SHOW
module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" }
    });

  const bookings = await Booking.find({
    listing: listing._id,
    status: "reserved"
  });

  res.render("listings/show", { listing, bookings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// CREATE
module.exports.createListing = async (req, res) => {
  // Convert location → coordinates
  const geoResponse = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  // Create listing
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  // REQUIRED geometry field
  listing.geometry = {
    type: "Point",
    coordinates: geoResponse.body.features[0].geometry.coordinates,
  };

  // Image
  listing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };

  await listing.save();
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${listing._id}`);
};


// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body.listing
  );

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${listing._id}`);
};

// DELETE
module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};