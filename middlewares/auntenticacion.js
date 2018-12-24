var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

exports.verificaToken = (req, res, next) => {
  var token = req.query.token;
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: "Token Incorrecto",
        errors: err
      });
    }

    req.usuario_creador = decoded.usuario
    next();
  /*   res.status(200).send({ ok: true, decoded: decoded }); */
  });
};

/* MIDDLEWARE PARA VERIFICAR QUE EL TOKEN ES VALIDO */
