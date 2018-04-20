// Full Documentation - https://www.turbo360.co/docs
const turbo = require("turbo360")({ site_id: process.env.TURBO_APP_ID });
const vertex = require("vertex360")({ site_id: process.env.TURBO_APP_ID });
const router = vertex.router();

router.get("/", (req, res) => {
  turbo.fetch("building", null).then(buildings => {
    res.render("index", { data: buildings });
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
