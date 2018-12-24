var express = require("express");

var routes = express.Router();

routes.get("/", (req, res, next) => {
  res
    .status(200)
    .json({ ok: true, mensaje: "Peticion realizada correctamente" });
});


module.exports = routes;