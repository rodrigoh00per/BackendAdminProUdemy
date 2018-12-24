var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

var routes = express.Router();

var Usuario = require("../models/usuario");

//ESTA ES LA RUTA PARA VERIFICAR QUE EXISTA UN USUARIO O NO
routes.post("/", (req, res) => {
  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al al buscar usuarios",
        errors: err
      });
    }
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales Incorrectas - email ",
        errors: err
      });
    }
    //este nos permite comparar un string que no ha sido encriptado con el que ya lo esta
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales Incorrectas - password",
        errors: err
      });
    }
    //CREAR UN TOKEN !!!!!!!!!

    //firmamos los datos y dentro va la data y dentro va un payload ,
    //despues tenemos que hacer algo para que nuestro token sea unico (SEED en español semilla)
    //despues viene nuestro fecha de expiracion de ese token (4 seg en este caso)
    usuarioDB.password = ":D";
    let token = jwt.sign({ usuario: usuarioDB }, SEED, {
      expiresIn: 14400
    });

    return res
      .status(200)
      .json({ ok: true, usuario: usuarioDB, token: token, id: usuarioDB._id });
  });
});

module.exports = routes;
