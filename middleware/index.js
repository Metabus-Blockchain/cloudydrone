let Poster = require("../models/index"),
    Comment = require("../models/comment");

// ALL MIDDLEWARE GOES HERE
let middlewareObj = {};

// POSTER AUTHENTICATION
middlewareObj.checkPosterOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Poster.findById(req.params.id, (err, foundPoster) => {
            if(err || !foundPoster) {
                res.redirect("back")
            } else {
                // USER OWN THE POSTER?
                if (foundPoster.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // IF NOT, REDIRECT
                    res.redirect("back")
                }
            }
        });        
    } else {
        res.redirect("back");
    }
};


// COMMENT AUTHENTICATION
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err || !foundComment) {
                res.redirect("back")
            } else {
                // USER OWN THE POSTER?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // IF NOT, REDIRECT
                    res.redirect("back")
                }
            }
        });        
    } else {
        res.redirect("back");
    }
};

// IS LOGGINED IN
middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;