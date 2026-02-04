const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/test";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const dataWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "697cb50b5c626ef5923405c1",
    // image: { url, filename }
  }));

  await Listing.insertMany(dataWithOwner);
  console.log("Data was initialized");
};

initDB();
