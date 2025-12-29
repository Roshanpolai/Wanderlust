const mongoose = require("mongoose");
const schema = mongoose.schema;

const ListeningSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
       type: String,
       
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", ListeningSchema);
modules.export = Listing;