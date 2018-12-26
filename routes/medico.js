var express = require("express");

var routes = express.Router();

routes.get("/", (req, res, next) => {
  res
    .status(200)
    .json({ ok: true, mensaje: "Peticion realizada correctamente" });
});

module.exports = routes;
var express = require("express");

var middlewareAuth = require("../middlewares/auntenticacion");

var routes = express.Router();

//IMPORTAMOS EL MODELO DE Medico
var Medico = require("../models/medico");

/* 
=================================================================
==============RUTA GET QUE REGRESA TODOS LOS MEDICOS============
*/
routes.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({})
    .skip(desde) //con el skip le digo saltate por ejemplo los primeros 4
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("hospital")
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando Medicos",
          errors: err
        });
      }
      Medico.count({}, (err, conteo) => {
        return res
          .status(200)
          .json({ ok: true, medicos: medicos, total: conteo });
      });
    
    });
});

/* 
=================================================================
==============RUTA POST PARA CREAR UN NUEVO Medico============
=================================================================
*/

routes.post("/", middlewareAuth.verificaToken, (req, res) => {
  console.log(req.usuario_creador);

  let body = req.body;

  let medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario_creador._id,
    hospital: body.hospital
  });
  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el Medico",
        errors: err
      });
    }
    return res.status(201).json({
      ok: true,
      medico: medicoGuardado
    });
  });
});
/* ================================================================
==============RUTA PUT PARA ACTUALIZAR UN MEDICO EXISTENTE============
=================================================================
 */

routes.put("/:id", middlewareAuth.verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar Medico",
        errors: err
      });
    }
    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: "El Medico con el id:" + id + "no existe",
        errors: { message: "no existe un Medico con ese ID" }
      });
    }
    medico.nombre = body.nombre;

    medico.usuario = req.usuario_creador._id;

    medico.hospital = body.hospital;

    medico.save((err, medicoActualizado) => {
      if (err) {
        return res.status(400).json({
          //PUEDE QUE NO ESTE MANDADO EL CORREO VACIO O COSAS ASI
          ok: false,
          mensaje: "Error al actualizar el hopsital",
          errors: err
        });
      }

      return res.status(200).json({ ok: true, medico: medicoActualizado });
    });
  });
});

/* ================================================================
==============RUTA DELETE PARA ELIMINAR UN MEDICO EXISTENTE============
=================================================================
 */
routes.delete("/:id", middlewareAuth.verificaToken, (req, res) => {
  var id = req.params.id;

  Medico.findByIdAndDelete(id, (err, medicoEliminado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al eliminar el Medico",
        errors: err
      });
    }
    if (!medicoEliminado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un Medico con ese Id",
        errors: { message: "No existe un Medico con ese id" }
      });
    }
    return res.status(200).json({ ok: true, medico: medicoEliminado });
  });
});

module.exports = routes;
