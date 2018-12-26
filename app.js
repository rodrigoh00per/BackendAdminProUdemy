//REQUIRES
const express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

let rutas_principal = require("./routes/app");
let rutas_usuario = require("./routes/usuario");
let ruta_login = require("./routes/login");
let rutas_hospital = require("./routes/hospital");
let rutas_medico = require("./routes/medico");
let ruta_busqueda = require("./routes/busqueda");
let ruta_upload = require("./routes/upload");
let ruta_pruebacarga = require("./routes/pruebadescarga");
let ruta_verimagen = require("./routes/imagenes");
//inicializacion de variables
var app = express();

//BODY PARSER

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//-----------IMPORTACION DE RUTAS------------------------------

//SERVER INDEX CONFIG
/* var serveIndex = require("serve-index");
app.use(express.static(__dirname + "/"));
app.use("/uploads", serveIndex(__dirname + "/uploads")); */

//RUTAS

//IMPORTAMOS LA RUTA DE USUARIO
app.use("/usuario", rutas_usuario);
app.use("/login", ruta_login);

//IMPORTAMOS LA RUTA DE HOSPITAL
app.use("/hospital", rutas_hospital);

//IMPORTAMOS LA RUTA DE MEDICO
app.use("/medico", rutas_medico);

//IMPORTAMOS LA RUTA DE LAS BUSQUEDA
app.use("/busqueda", ruta_busqueda);

app.use("/upload", ruta_upload);

app.use("/pruebacarga", ruta_pruebacarga);

app.use("/img", ruta_verimagen);

app.use("/", rutas_principal);

//--------------TERMINA LA IMPORTACION DE RUTAS------------------∆
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
