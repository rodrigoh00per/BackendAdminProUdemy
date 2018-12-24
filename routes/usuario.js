var express = require("express");
var bcrypt = require("bcryptjs");
var middlewareAuth = require("../middlewares/auntenticacion");

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
=================================================================
*/

routes.post("/", middlewareAuth.verificaToken, (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
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
    return res
      .status(201)
      .json({
        ok: true,
        usuario: usuarioGuardado,
        tokenusuario: req.usuario_creador
      });
  });
});
/* ================================================================
==============RUTA PUT PARA ACTUALIZAR UN USUARIO EXISTENTE============
=================================================================
 */

routes.put("/:id", middlewareAuth.verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar  usuario",
        errors: err
      });
    }
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id:" + id + "no existe",
        errors: { message: "no existe un usuario con ese ID" }
      });
    }
    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioActualizado) => {
      if (err) {
        return res.status(400).json({
          //PUEDE QUE NO ESTE MANDADO EL CORREO VACIO O COSAS ASI
          ok: false,
          mensaje: "Error al actualizar el usuario",
          errors: err
        });
      }
      usuarioActualizado.password = ":D";
      return res.status(200).json({ ok: true, usuario: usuarioActualizado });
    });
  });
});

/* ================================================================
==============RUTA DELETE PARA ELIMINAR UN USUARIO EXISTENTE============
=================================================================
 */
routes.delete("/:id", middlewareAuth.verificaToken, (req, res) => {
  var id = req.params.id;

  Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al eliminar el usuario",
        errors: err
      });
    }
    if (!usuarioEliminado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un usuario con ese Id",
        errors: { message: "No existe un usuario con ese id" }
      });
    }
    return res.status(200).json({ ok: true, usuario: usuarioEliminado });
  });
});

module.exports = routes;
