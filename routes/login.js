//importamos el client id

var CLIENT_ID = require("../config/config").CLIENT_ID;

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

var routes = express.Router();

var Usuario = require("../models/usuario");
//AUTENTICACION GOOGLE
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload(); //AQUI VIENE TODA LA INFO DEL USER
  /*  const userid = payload['sub']; */
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}
verify().catch(console.error);

routes.post("/google", async (req, res) => {
  var token = req.body.token;

  //con el await le decimos espera una respuesta de esa funcion
  let googleUser = await verify(token).catch(e => {
    return res.status(403).json({
      ok: false,
      mensaje: "Token no valido"
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al al buscar usuarios",
        errors: err
      });
    }
    //SI EL USUARIO YA SE HABIA REGISTRADO ANTES DALE CREMAS
    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          mensaje: "Debe de usar su autenticacion normal"
        });
      } else {
        let token = jwt.sign({ usuario: usuarioDB }, SEED, {
          expiresIn: 14400
        });

        return res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token: token
        });
      }
      //SI NO ESTA EL JOVENSUELO PUES CREA ESE USUARIO EN LA BD
    } else {
      //el usuario no existe hay que crearlo
      var usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuarioDB) => {
        let token = jwt.sign({ usuario: usuarioDB }, SEED, {
          expiresIn: 14400
        });
        return res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token: token,
          id: usuarioDB._id
        });
      });
    }
  });

  /* return res.status(200).json({ ok: true, mensaje: googleUser }); */
});

//TERMINA AUTENTICACION POR GOOGLE

//AUTENTICACION NORMAL
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
