var express = require("express");

var routes = express.Router();

//IMPORTAMOS EL MODELO DE USUARIO
var Usuario = require("../models/usuario");

/* 
=================================================================
==============RUTA GET QUE REGRESA TODOS LOS USUARIOS============
*/
routes.get("/", (req, res, next) => {
  Usuario.find({}, "nombre email img role").exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando usuarios",
        errors: err
      });
    }

    return res.status(200).json({ ok: true, usuarios: usuarios });
  });
});
/* 
=================================================================
==============RUTA POST PARA CREAR UN NUEVO USUARIO============
*/

routes.post("/", (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: body.password,
    img: body.img,
    role: body.role
  });
  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el usuario",
        errors: err
      });
    }
    return res.status(201).json({ ok: true, usuario: usuarioGuardado });
  });
});
module.exports = routes;
