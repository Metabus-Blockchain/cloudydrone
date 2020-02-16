let express     = require("express"),
    router      = express.Router(),
    middleware  = require("../middleware"),
    Poster      = require("../models/index"),
    multer = require('multer'),
    storage = multer.diskStorage({
        filename: function(req, file, callback) {
          callback(null, Date.now() + file.originalname);
        }
      });

      var imageFilter = function (req, file, cb) {
        // accept image files only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    };
    var upload = multer({ storage: storage, fileFilter: imageFilter})
    require('dotenv').config()
    var cloudinary = require('cloudinary');
    cloudinary.config({ 
      cloud_name: 'dqu3epati', 
      api_key: API_KEY, 
      api_secret: API_SECRET_KEY
    });



router.get("/", (req, res) => {
    // Get all posters from DB
    Poster.find({}, (err, allPosters) => {
        if (err) {
            console.log(err)
        } else {
            res.render("poster/index", { posters: allPosters });
        }
    });
});


// CREATE - ADD A NEW PROFILE TO DB
router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res) => {
    cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        // add cloudinary url for the image to the poster object under image property
        req.body.poster.image = result.secure_url;
        // add image's public_id to campground object
        req.body.poster.imageId = result.public_id;
        // add author to poster
        req.body.poster.author = {
          id: req.user._id,
          username: req.user.username,
          firstName: req.user.firstName,
          lastName: req.user.lastName
        }

    // Create a new post and save to DB
    Poster.create(req.body.poster, (err, newlyPost) => {
        if (err) {
            req.flash("error", err.message)
            return res.redirect("back");
        }
        // redirect to idnex
        res.redirect("/poster/" + newlyPost.id);
        })
    })
})

// NEW - SHOW THE FORM TO CREATE NEW PROFILE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("poster/new")
});

// SHOW - SHOWS MORE INFO ABOUT ONE POST
router.get("/:id", (req, res) => {
    // FIND THE POSTER WITH PROVIDED ID
    Poster.findById(req.params.id).populate("comments").exec((err, foundPoster) => {
        if(err || !foundPoster) {
            req.flash("error", "Poster not found")
            res.redirect("/")
        } else {
            res.render("poster/show", { poster: foundPoster })
        }
    });
});

// EDIT - EDITS THE POSTER
router.get("/:id/edit", middleware.checkPosterOwnership, (req, res) => {
    Poster.findById(req.params.id, (err, foundPoster) => {
        res.render("poster/edit", { poster: foundPoster });
    });
});

// UPDATE - UPDATE THE EDIT
router.put("/:id", middleware.checkPosterOwnership, upload.single("image"), (req, res) => {
    // FIND AND UPDATE THE CORRECT POSTER
    Poster.findById(req.params.id, async (err, poster) => {
        if(err) {
            req.flash('error', err.message);
            res.redirect("back");
        } else {
            if (req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(poster.imageId);
                    let result = await cloudinary.v2.uploader.upload(req.file.path);
                    poster.imageId = result.public_id;
                    poster.image = result.secure_url;
                } catch(err) {
                    req.flash('error', err.message);
                    return res.redirect("back");
                }
            }
            poster.skills = req.body.poster.skills;
            poster.description = req.body.poster.description;
            poster.price = req.body.poster.price;
            poster.location = req.body.poster.location;
            poster.save();
            req.flash("success", "Successfully Updated!")
            // REDIRECT TO SHOW PAGE
            res.redirect("/poster/" + req.params.id);
        }
    });
});

// DELETE - DELETE THE POSTER
router.delete("/:id", middleware.checkPosterOwnership, (req, res) => {
    Poster.findById(req.params.id, async (err, poster) => {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } 
        try {
            await cloudinary.v2.uploader.destroy(poster.imageId);
            poster.remove();
            req.flash("success", "Your post is deleted successfully.")
            res.redirect("/poster")
        } catch(err) {
            if(err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
        }
    })
})

module.exports = router;