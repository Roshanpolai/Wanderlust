const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs"); 
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const MONGO_URL = "mongodb://127.0.0.1:27017/test";

main().then(() => {
    console.log("connected to DB");
}) .catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("viwes",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req,res) => {
    res.send("Hello World!");
})

//Get all listings
app.get("/listings", async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})

//New listing form
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});

//Get listing by ID
app.get("/listings/:id", async(req,res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//Create new listing
app.post("/listings", async(req,res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
});

//Edit listing 
app.get("/listings/:id/edit", async(req,res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update listing
app.put("/listings/:id", async(req,res) => {
    const {id} = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${updatedListing._id}`);
});

//Delete listing
app.delete("/listings/:id", async(req,res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});






// app.get("/testListing", async(req,res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Bhubaneswar, Odisha",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample is saved");
//     res.send("Successful testing");
// })

app.listen(8000, () => {
    console.log("Server listening on port 8000");
});