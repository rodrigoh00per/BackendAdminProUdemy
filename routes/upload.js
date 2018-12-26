var express = require("express");
const fileupload = require("express-fileupload");
var routes = express.Router();

//ESTA ES LA QUE USAMOS PARA LA CARGA DE LOS ARCHIVOS
routes.use(fileupload());

//IMPORTAMOS FS PARA VER SI EXISTE UN ARCHIVO
var fs = require("fs");

//IMPORTAMOS LOS MODELOS
var Usuario = require("../models/usuario");
var Hospital = require("../models/hospital");
var Medico = require("../models/medico");

//ESTA ES LA RUTA PARA LA CARGA DE IMAGENES
routes.put("/:tipo/:id", (req, res, next) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  //TIPOS DE COLECCION
  let tiposValidos = ["hospital","medico", "usuario"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Tipo de coleccion no Valida",
      errors: { message: "Tipo de coleccion no Valida" }
    });
  }

  //validamos si viene o no el archivo
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No selecciono nada",
      errors: { message: "Debe seleccionar una imagen" }
    });
  }

  //Obtener nombre del a imagen
  let archivo = req.files.imagen; //SE RECIBE LA IMAGEN
  let nombreCortado = archivo.name.split(".");
  let extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //SOLO ESTAS EXTENSIONES SON PERMITIDAS
  var extensionesvalidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesvalidas.indexOf(extensionArchivo) < 1) {
    return res.status(400).json({
      ok: false,
      mensaje: "Extension Invalida",
      errors: {
        message: "La extension debe de ser: " + extensionesvalidas.join(",")
      }
    });
  }

  //NOMBRE DE ARCHIVO PERSONALIZADO
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  //MOVER EL ARCHIVO A UN PATH
  let path = `./uploads/${tipo}/${nombreArchivo}`;
  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: " Error al mover archivo",
        errors: err
      });
    }
    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

//FUNCTION PARA SUBIR POR TIPO IMAGEN
function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuario") {
    Usuario.findById(id, (err, usuario) => {
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: "Usuario no Existe",
          errors: "Usuario no Existe"
        });
      }
      console.log("EL PATH DE LA IMAGEN ES TAL ", usuario.img);
      let pathViejo = "./uploads/usuario/" + usuario.img;
      //si existe elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        console.log("EL PATH VIEJO ES ", pathViejo);
        fs.unlinkSync(pathViejo); //recuerda usar unlinksync si no se muere
      }
      usuario.img = nombreArchivo; //el nuevo nombre que se le pondra

      usuario.save((err, usuarioActualizado) => {
        usuarioActualizado.password = ":D";
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen de Usuario Actualizada",
          usuario: usuarioActualizado
        });
      });
    });
  }

  if (tipo === "medico") {
    Medico.findById(id, (err, medico) => {
      if (!medico) {
        return res.status(400).json({
          ok: false,
          mensaje: "Medico no Existe",
          errors: "Medico no Existe"
        });
      }

      console.log("EL PATH DE LA IMAGEN ES TAL ", medico.img);
      let pathViejo = "./uploads/medico/" + medico.img;
      //si existe elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        console.log("EL PATH VIEJO ES ", pathViejo);
        fs.unlinkSync(pathViejo); //recuerda usar unlinksync si no se muere
      }
      medico.img = nombreArchivo; //el nuevo nombre que se le pondra

      medico.save((err, medicoActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen de Medico Actualizada",
          usuario: medicoActualizado
        });
      });
    });
  }

  if (tipo === "hospital") {
    Hospital.findById(id, (err, hospital) => {
      if (!hospital) {
        return res.status(400).json({
          ok: false,
          mensaje: "Hospital no Existe",
          errors: "Hospital no Existe"
        });
      }

      console.log("EL PATH DE LA IMAGEN ES TAL ", hospital.img);
      let pathViejo = "./uploads/hospital/" + hospital.img;
      //si existe elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        console.log("EL PATH VIEJO ES ", pathViejo);
        fs.unlinkSync(pathViejo); //recuerda usar unlinksync si no se muere
      }
      hospital.img = nombreArchivo; //el nuevo nombre que se le pondra

      hospital.save((err, hospitalActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen de Hospital Actualizada",
          hospital: hospitalActualizado
        });
      });
    });
  }
}

module.exports = routes;
