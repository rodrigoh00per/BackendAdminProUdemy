//REQUIRES
const express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var rutas_principal = require("./routes/app");
var rutas_usuario = require("./routes/usuario");

//inicializacion de variables
var app = express();


//BODY PARSER

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



//RUTAS IMPORTACION

app.use("/", rutas_principal);
app.use("/usuario", rutas_usuario);


//CONEXION A LA BASE DE DATOS
mongoose
  .connect("mongodb://localhost:27017/hospitalDB")
  .then(() => {
    console.log("Base de datos levantada en el puerto 27017");
  })
  .catch(() => {
    console.log("Hay un problema al levantar la BD");
  });

//Escuchar peticiones

app.listen(3000, () => {
  console.log("Servidor Express levantado corriendo en el puerto 3000");
});
