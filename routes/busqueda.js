var express = require("express");

var routes = express.Router();

var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

/*
===============================================================
AQUI ESTA LA RUTA QUE CUAL HACE LA BUSQUEDA POR COLECCION
===============================================================
*/

routes.get("/coleccion/:tabla/:busqueda", (req, res) => {
  let tabla = req.params.tabla;
  let busqueda = req.params.busqueda;
  let regex = new RegExp(busqueda, "i");
  var promesa;
  switch (tabla) {
    case "usuarios":
      promesa = buscarUsuarios(regex);
      break;
    case "medicos":
      promesa = buscarMedicos(regex);
      break;
    case "hospitales":
      promesa = buscarHospitales(regex);
      break;
    default:
      return res.status(400).json({
        ok: false,
        mensaje:
          "Los tipos de busqueda solo son : usuarios,medicos y hospitales",
        error: { message: "Tipo de tabla/coleccion no valido" }
      });
  }
  promesa.then(data => {
    res.status(200).json({
      ok: true,
      [tabla]: data
    });
  });
});

/*
===============================================================
AQUI ESTA LA RUTA QUE CUAL HACE LA BUSQUEDA EN TODAS LAS TABLAS
===============================================================
*/
routes.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;

  //creamos una expresion regular para que sea insensible a mayusculas y minusculas
  var regex = new RegExp(busqueda, "i");
  //aqui tenemos un arreglo de problemas para regresar varias simultaneamente
  Promise.all([
    buscarHospitales(regex),
    buscarMedicos(regex),
    buscarUsuarios(regex)
  ]).then(respuestas => {
    res.status(200).json({
      ok: true,
      hospitales: respuestas[0],
      medicos: respuestas[1],
      usuarios: respuestas[2]
    });
  });
});

function buscarHospitales(regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .exec((err, hospitales) => {
        if (err) {
          reject("Error al cargar hospitales", err);
        } else {
          resolve(hospitales);
        }
      });
  });
}

function buscarMedicos(regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .exec((err, medicos) => {
        if (err) {
          reject("Error al cargar medicos", err);
        } else {
          resolve(medicos);
        }
      });
  });
}

function buscarUsuarios(regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({}, "nombre email role")
      .or([{ nombre: regex }, { email: regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject("Error al Cargar Usuarios", err);
        } else {
          resolve(usuarios);
        }
      });
  });
}

module.exports = routes;
