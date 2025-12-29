const express = require("express");//imports Express,a Node.js framework
const app = express();//Create app object
const mongoose = require("mongoose");//MongoDB connection
const ejs = require("ejs"); //EJS is a template engine // Used to render dynamic HTML pages

const MONOGO_URL = "mongodb://127.0.0.1:27017/test";

main().then(() => {
    console.log("connected to DB");
}) .catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONOGO_URL);
}

//API
app.get("/", (req,res) => {
    res.send("Hello World!");
})

app.listen(8000, () => {
    console.log("Server listening on port 8000");
});