// Full Documentation - https://www.turbo360.co/docs
const turbo = require("turbo360")({ site_id: process.env.TURBO_APP_ID })
const vertex = require("vertex360")({ site_id: process.env.TURBO_APP_ID })
const router = vertex.router()

router.get("/", (req, res) => {
  turbo.fetch("building", null).then(buildings => {
    res.render("index", { data: buildings })
  })
})

router.get("/:buildingSlug", (req, res) => {
  let building = {}
  turbo
    .fetch("building", { slug: req.params.buildingSlug })
    .then(buildings => {
      building = buildings[0]
      return turbo.fetch('apartment', {building: buildings[0].id})
    })
    .then((apartments) => {
      console.log(JSON.stringify(apartments))
      building.apartments = apartments
      res.render('building', building)
    })
    .catch(err => {
      console.log(err)
      return
    })
})

router.post('/apartment/:id', (req, res) => {
  let id = req.params.id
  let newApartment = req.body
  turbo.updateEntity('apartment', id, newApartment)
  .then((data) => {
    res.redirect('/')
  })
  .catch((err) => {
    res.redirect('/')
  })

  return
})

router.post('/:buildingSlug', (req, res) => {
  let params = req.body

  turbo
    .fetch("building", { slug: req.params.buildingSlug })
    .then(buildings => {
      params.building = buildings[0].id
      return turbo.create('apartment', params)
    })
    .then((apartment) => {
      console.log(apartment)
      res.redirect('/' + req.params.buildingSlug)
    })
    .catch(err => {
      console.log(err)
    })
})

/*  This route render json data */
router.get("/json", function(req, res) {
  res.json({
    confirmation: "success",
    app: process.env.TURBO_APP_ID,
    data: "this is a sample json route."
  })
})

/*  This route sends text back as plain text. */
router.get("/send", function(req, res) {
  res.send("This is the Send Route")
})

/*  This route redirects requests to Turbo360. */
router.get("/redirect", function(req, res) {
  res.redirect("https://www.turbo360.co/landing")
})

module.exports = router
