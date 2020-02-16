var mongoose = require("mongoose");

// SCHEMA SETUP
let posterSchema = new mongoose.Schema({
    image: String,
    imageId: String,
    description: String,
    price: String,
    skills: String,
    location: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        firstName: String,
        lastName: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// COMPLIE A MODEL TO SCHEMA
module.exports = mongoose.model("Poster", posterSchema);