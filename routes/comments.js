let express     = require("express"),
    router      = express.Router({ mergeParams: true }),
    Poster      = require("../models/index"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");


// VIEW - NEW COMMENT ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // FIND A POSTER BY ITS ID
    Poster.findById(req.params.id, (err, poster) => {
        if(err) {
            console.log(err)
        } else {
            res.render("comments/new", { poster: poster });
        }
    });
});

// VIEW - CREATE COMMENT ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
    Poster.findById(req.params.id, (err, poster) => {
        if(err) {
            console.log(err);
            res.redirect("/poster");
        } else {
            console.log(req.body.comment)
            // CREATE NEW COMMENT
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Something went wrong")
                    console.log(err)
                } else {
                    // ADD USERNAME AND ID TO COMMENT
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.firstName = req.user.firstName;
                    comment.author.lastName = req.user.lastName;

                    // SAVE COMMENT
                    comment.save();
                    poster.comments.push(comment);
                    poster.save();
                    req.flash("success", "Successfully added comment")
                    res.redirect("/poster/" + poster._id);
                }
            })
        }
    });
});

// EDIT - EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Poster.findById(req.params.id, (err, foundPoster) => {
        if(err || !foundPoster) {
            return res.redirect("back")
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back")
            } else {
                res.render("comments/edit", { poster_id: req.params.id, comment: foundComment})
            }
        })
    })
})

// UPDATE EDIT - COMMENT EDIT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect("back")
        } else {
            res.redirect("/poster/" + req.params.id);
        }
    });
});

// DELETE - DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    // FIND BY ID AND REMOVE
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            res.redirect("back")
        } else {
            res.redirect("/poster/" + req.params.id)
        }
    })
})

module.exports = router;