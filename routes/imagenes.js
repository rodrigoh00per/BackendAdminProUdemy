var express = require("express");

var routes = express.Router();

const path = require("path");
const fs = require("fs");


//EN ESTA RUTA OBTENEMOS EL FILE GUARDADO DESDE NUESTRO SERVIDOR 
routes.get("/:tipo/:img", (req, res, next) => {
  let tipo = req.params.tipo;
  let img = req.params.img;

  var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    var pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
    res.sendFile(pathNoImage);
  }
 
});

module.exports = routes;
