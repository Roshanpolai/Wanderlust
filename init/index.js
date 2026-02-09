const mongoose = require("mongoose");
const listings = require("./data.js"); // <-- array
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/test";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("connected to DB"))
  .catch(err => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Old listings deleted");

  const dataWithOwner = listings.map(obj => ({
    ...obj,
    owner: "697cb50b5c626ef5923405c1" // make sure this user exists
  }));

  await Listing.insertMany(dataWithOwner);
  console.log("Data was initialized");

  mongoose.connection.close();
};

initDB();