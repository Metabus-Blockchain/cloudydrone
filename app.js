let express       = require("express"),
    app           = express(),
    seedDB        = require("./seeds"),
    bodyParser    = require("body-parser"),
    flash         = require("connect-flash"),
    User          = require("./models/user"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride= require("method-override"),
    mongoose      = require("mongoose");


// requiring routes
var posterRoutes = require("./routes/poster"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

// LOCAL ENVIRONMENT AND PROD ENV
var databaseUrl = process.env.DATABASEURL || "mongodb://localhost:27017/cloudydrone";
mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session") ({
    secret: "I have a billion dollars in my bank account",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// END OF PASSPORT CONFIG.

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})



app.use("/", indexRoutes);
app.use("/poster", posterRoutes);
app.use("/poster/:id/comments", commentRoutes);


app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("Workingdur server has started!")
})