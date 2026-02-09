const Joi = require("joi");

// LISTING SCHEMA
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),

    // Image is handled by Multer + Cloudinary
    image: Joi.object({
      filename: Joi.string().optional(),
      url: Joi.string().optional(),
    }).optional(),

    price: Joi.number().min(0).required(),

    location: Joi.string().trim().required(),
    country: Joi.string().trim().required(),

    category: Joi.string()
      .valid(
        "trending",
        "rooms",
        "iconic",
        "castles",
        "beach",
        "pools",
        "camping",
        "farms",
        "arctic"
      )
      .required(),
  }).required(),
});

// REVIEW SCHEMA
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().trim().required(),
  }).required(),
});