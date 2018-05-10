// Full Documentation - https://www.turbo360.co/docs
const turbo = require("turbo360")({ site_id: process.env.TURBO_APP_ID })
const vertex = require("vertex360")({ site_id: process.env.TURBO_APP_ID })
const router = vertex.router()

const config = {
    missingImage: "https://lh3.googleusercontent.com/c1zIxJ41LhtPnF_WYx8c-Ckyk2xygEtbhO5ltd0WaNFDtuAkESYRQINkxb_GHPMnjWhhLMp5kcy4EvuDdwMgWPQPRA"
}

const adminAccess = req => {
  return new Promise((resolve, reject) => {
    // session not defined, user not logged in
    if (req.vertexSession == null) {
      resolve(false)
    }

    // user key in session not defined, user not logged in
    if (req.vertexSession.user == null) {
      resolve(false)
    }

    turbo
      .fetchUser(req.vertexSession.user.id)
      .then(data => {
        resolve(data.accountType === 'Admin')
      })
      .catch(err => {
        resolve(false)
      })
    })
  }


  router.get("/", function(req, res) {
    turbo.fetch("building", null).then(buildings => {
      res.render("index", { data: buildings })
    })
  })

  router.get("/login", function(req, res) {
    res.render("login");
  })

  router.post('/login', function(req, res) {
    console.log(req.body)
    turbo.login(req.body)
      .then(data => {
      console.log(data)
      req.vertexSession.user = { id: data.id } // set session with user ID
    })
      .catch(err => {
        res.redirect('/error')
      })
    })

    router.get("/admin", function(req, res) {
      adminAccess(req)
      .then(access => {
        if(access){
          res.render('admin')
        } else {
          res.redirect('/')
        }
      })
      .catch(err => {
        res.redirect('/')
      })
    })

    router.post('/user', function(req, res) {
      console.log(req.body)
      turbo.createUser(req.body)
        .then(data => {
        console.log(data)
        res.redirect('/admin')
      })
        .catch(err => {
        console.log(err)
        res.redirect('/error')
      })
    })

    router.get("/error", function(req, res) {
      res.redirect("/")
    })

    router.get("/:buildingSlug", function(req, res) {
      let building = {}
      turbo
        .fetch("building", { slug: req.params.buildingSlug })
        .then(buildings => {
          building = buildings[0];
            return turbo.fetch("apartment", { building: buildings[0].id })
          })
        .then(apartments => {
          apartments.forEach((apt, i) => {
            turbo.fetch("userImage", { apartmentId: apt.id }).then(data => {
              apartments[i].remoteImages = data
              if (apartments.length - 1 === i) {
                building.apartments = apartments
                adminAccess(req) 
                .then(access => {
                  if(access){
                    res.render("building", building)
                  } 
                    res.render("buildingAd", building) 
                  })
                  .catch((err) => {
                    res.render("buildingAd", building)
                  })
                }
              })
            })
          })
        .catch(err => {
          console.log(err)
          return;
        })
      })

    router.post("/apartment/:id", function(req, res) {
      let id = req.params.id;
      let newApartment = req.body;
      if (!newApartment.mainImage) {
      console.log("hit?")
      newApartment.mainImage = config.missingImage;
    }

    turbo
      .updateEntity("apartment", id, newApartment)
      .then(data => {
        res.redirect("/");
      })
      .catch(err => {
        res.redirect("/");
      });

      return;
    });

    router.post("/:buildingSlug", function(req, res) {
      let params = req.body;
      if (!params.mainImage) {
        console.log("hit?");
        params.mainImage = config.missingImage;
      }

      turbo
        .fetch("building", { slug: req.params.buildingSlug })
        .then(buildings => {
          params.building = buildings[0].id;
          return turbo.create("apartment", params);
        })
        .then(apartment => {
          console.log(apartment);
          res.redirect("/" + req.params.buildingSlug);
        })
        .catch(err => {
          console.log(err);
        });
      });

      /*  This route render json data */
      router.get("/json", function(req, res) {
        res.json({
          confirmation: "success",
          app: process.env.TURBO_APP_ID,
          data: "this is a sample json route."
        });
      });

      /*  This route sends text back as plain text. */
      router.get("/send", function(req, res) {
        res.send("This is the Send Route");
      });

      /*  This route redirects requests to Turbo360. */
      router.get("/redirect", function(req, res) {
        res.redirect("https://www.turbo360.co/landing");
      });


module.exports = router;