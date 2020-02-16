var express     = require("express");
var router      = express.Router();
let passport    = require("passport");
let User        = require("../models/user");

// LANDING ROUTE
router.get("/", (req, res) => {
    res.render("landing")
})

// VIEW - SHOW SIGNUP PAGE
router.get("/signup", (req, res) => {
    res.render("signup")
})

// HANDLING SIGNUP LOGIC
router.post("/signup", (req, res) => {
    let newUser = new User(
        { 
            username: req.body.username, 
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            avatar: req.body.avatar
        }
    )
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash("ERROR: ", err)
            return res.render("signup")
        } 
        passport.authenticate("local") (req, res, () => {
            req.flash("success", "Welcome to CloudyDrone, " + user.firstName + "!")
            res.redirect("/poster")
        })
    })
})

// VIEW - LOGIN PAGE
router.get("/login", (req, res) => {
    res.render("login")
})

// HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/poster",
        failureRedirect: "/login"
    }), (req, res) => {}
)

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You are logged out.")
    res.redirect("/poster");
});

// USER PROFILE
router.get("/users/:id", (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err) {
            res.redirect("/")
        }
        res.render("users/show", { user: foundUser })
    })
})

// EDIT USER PROFILE
router.get("/users/:id/edit", (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err) {
            res.redirect("/")
        } 
        res.render("users/edit", { user: foundUser });
    });
});

// UPDATE EDIT ROUTE
router.get("/users/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body.user, (err, updatedProfile) => {
        if(err) {
            res.redirect("users/show")
        } else {
            res.redirect("users/" + req.params.id)
        }
    })
})

module.exports = router;






