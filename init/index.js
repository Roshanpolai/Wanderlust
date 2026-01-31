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
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

// const initDB = async() => {
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
//     console.log("Data was initialized");
// };

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data.map((obj) => ({
    ...obj, owner: "697cb50b5c626ef5923405c1", // add owner field
  }));

  const cleanedData = initData.data.map((obj) => ({
    ...obj,
    image: obj.image.url, // convert object → string
  }));

  await Listing.insertMany(cleanedData);
  console.log("Data was initialized");
};

initDB();