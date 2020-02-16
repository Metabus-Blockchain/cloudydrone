let mongoose    = require("mongoose"),
    Poster      = require("./models/index");


var data = [
    {
        name: "Jay Lee",
        image: "https://images.unsplash.com/photo-1564119913389-b0938825d0eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
        description: "Outdoor drone activity",
        price: "$400 / day",
        skills: "Adobe Photoshop",
        location: "Lehi ,UT"
    },
    {
        name: "Jay Kim",
        image: "https://images.unsplash.com/photo-1564119913389-b0938825d0eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
        description: "Outdoor drone activity",
        price: "$400 / day",
        skills: "Adobe Photoshop",
        location: "Lehi ,UT"
    }
]

function seedDB() {
    // remove all posters
    Poster.remove({}, err => {
        if (err) {
            console.log(err)
        }
        console.log("removed all posters")
        // Add a few posters
        data.forEach(seed => {
            Poster.create(seed, (err, poster) => {
                if(err) {
                    console.log(err)
                } else {
                    console.log("Added a poster")
                }
            })
        })
    })
}

module.exports = seedDB;