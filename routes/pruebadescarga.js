var express = require("express");

var download = require("download-file");
var routes = express.Router();

routes.get("/", (req, res, next) => {
  var url = "http://i.imgur.com/G9bDaPH.jpg";

  var options = {
    directory: "./uploads/medico/",
    filename: "cat.gif"
  };

  download(url, options, function(err) {
    if (err) {
      res.status(500).json({
        ok: true,
        mensaje: "Hubo un problema al descargar el recurso"
      });
    }
    return res.status(200).send({ mensaje: "Todo correcto con la imagen" });
  });
});

module.exports = routes;
