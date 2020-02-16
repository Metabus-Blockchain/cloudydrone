let mongoose              = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    avatar: String
})

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);