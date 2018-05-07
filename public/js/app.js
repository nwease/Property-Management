(function() {
  var turbo = Turbo({
    site_id: "5acdd73d74ffbd00149e1e4b"
  });

  $(".btn-upload").click(function(event) {
    event.preventDefault();
    turbo.uploadFile(function(err, data) {
      if (err) {
        alert("Error:" + err.message);
        return;
      }

      turbo.create(
        "userImage",
        { url: data.result.url, apartmentId: event.target.id },
        function(error, res) {
          console.log(error);
          console.log(res);
        }
      );
    });
  });
})();
