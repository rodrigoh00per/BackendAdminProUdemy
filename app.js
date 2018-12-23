//REQUIRES
const express = require("express");
var mongoose = require("mongoose");

//inicializacion de variables
var app = express();

//CONEXION A LA BASE DE DATOS
mongoose
  .connect("mongodb://localhost:27017/hospitalDB")
  .then(() => {
    console.log("Base de datos levantada en el puerto 27017");
  })
  .catch(() => {
    console.log("Hay un problema al levantar la BD");
  });

//RUTAS

app.get("/", (req, res, next) => {
  res
    .status(200)
    .json({ ok: true, mensaje: "Peticion realizada correctamente" });
});

//Escuchar peticiones

app.listen(3000, () => {
  console.log("Servidor Express levantado corriendo en el puerto 3000");
});
