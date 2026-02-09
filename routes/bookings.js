const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

router.post("/:id", isLoggedIn, async (req, res) => {
  const { checkIn, checkOut } = req.body.booking;

  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Owner cannot book
  if (listing.owner.equals(req.user._id)) {
    req.flash("error", "You cannot reserve your own listing");
    return res.redirect(`/listings/${listing._id}`);
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    req.flash("error", "Check-out must be after check-in");
    return res.redirect(`/listings/${listing._id}`);
  }

  // STEP 4 — OVERLAP CHECK
  const overlappingBooking = await Booking.findOne({
    listing: listing._id,
    status: "reserved",
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate }
  });

  if (overlappingBooking) {
    req.flash("error", "Selected dates are already booked");
    return res.redirect(`/listings/${listing._id}`);
  }

  // Nights calculation
  const nights =
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

  const totalPrice = nights * listing.price;

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice
  });

  await booking.save();

  res.redirect(`/bookings/${booking._id}`);
});


router.get("/:bookingId", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate("listing")
    .populate("user");

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/listings");
  }

  //Only booking owner can view
  if (!booking.user._id.equals(req.user._id)) {
    req.flash("error", "Access denied");
    return res.redirect("/listings");
  }

  res.render("bookings/show", { booking });
});

router.post("/:bookingId/cancel", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate("listing");

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/listings");
  }

  //Only booking owner can cancel
  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You are not allowed to cancel this booking");
    return res.redirect("/listings");
  }

  //Already cancelled
  if (booking.status === "cancelled") {
    req.flash("error", "Booking already cancelled");
    return res.redirect(`/bookings/${booking._id}`);
  }

  //Cancel booking
  booking.status = "cancelled";
  await booking.save();

  //Unlock listing
  booking.listing.isReserved = false;
  await booking.listing.save();

  req.flash("success", "Reservation cancelled successfully");
  res.redirect(`/bookings/${booking._id}`);
});

router.get("/", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("bookings/index", { bookings });
});

module.exports = router;
