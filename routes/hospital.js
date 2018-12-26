var express = require("express");

var middlewareAuth = require("../middlewares/auntenticacion");

var routes = express.Router();

//IMPORTAMOS EL MODELO DE HOSPITAL
var Hospital = require("../models/hospital");

/* 
=================================================================
==============RUTA GET QUE REGRESA TODOS LOS HOSPITALES============
*/
routes.get("/", (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({})
    .skip(desde) //con el skip le digo saltate por ejemplo los primeros 4
    .limit(5)
    .populate("usuario", "nombre email")
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando hospitales",
          errors: err
        });
      }
      Hospital.count({}, (err, conteo) => {
        return res
          .status(200)
          .json({ ok: true, hospitales: hospitales, total: conteo });
      });
    });
});

/* 
=================================================================
==============RUTA POST PARA CREAR UN NUEVO HOSPITAL============
=================================================================
*/

routes.post("/", middlewareAuth.verificaToken, (req, res) => {
  console.log(req.usuario_creador);

  let body = req.body;

  let hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario_creador._id
  });
  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el hospital",
        errors: err
      });
    }
    return res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    });
  });
});
/* ================================================================
==============RUTA PUT PARA ACTUALIZAR UN HOSPITAL EXISTENTE============
=================================================================
 */

routes.put("/:id", middlewareAuth.verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar hospital",
        errors: err
      });
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id:" + id + "no existe",
        errors: { message: "no existe un hospital con ese ID" }
      });
    }
    hospital.nombre = body.nombre;

    hospital.usuario = req.usuario_creador._id;

    hospital.save((err, hospitalActualizado) => {
      if (err) {
        return res.status(400).json({
          //PUEDE QUE NO ESTE MANDADO EL CORREO VACIO O COSAS ASI
          ok: false,
          mensaje: "Error al actualizar el hopsital",
          errors: err
        });
      }

      return res.status(200).json({ ok: true, hospital: hospitalActualizado });
    });
  });
});

/* ================================================================
==============RUTA DELETE PARA ELIMINAR UN HOSPITAL EXISTENTE============
=================================================================
 */
routes.delete("/:id", middlewareAuth.verificaToken, (req, res) => {
  var id = req.params.id;

  Hospital.findByIdAndDelete(id, (err, hospitalEliminado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al eliminar el hospital",
        errors: err
      });
    }
    if (!hospitalEliminado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un hospital con ese Id",
        errors: { message: "No existe un hospital con ese id" }
      });
    }
    return res.status(200).json({ ok: true, hospital: hospitalEliminado });
  });
});

module.exports = routes;
