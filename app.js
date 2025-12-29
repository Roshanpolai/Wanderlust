const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs"); 
const Listing = require("./models/listing.js");
const path = require("path");

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

app.get("/", (req,res) => {
    res.send("Hello World!");
})

//Lising route
app.get("/listings", async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})

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