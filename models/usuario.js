const mongoose = require("mongoose"); //aqui importamos mongoose
var uniqueValidator = require("mongoose-unique-validator"); //este plugin nos permite para la parte de las validaciones en mongoo

var Schema = mongoose.Schema; //tenemos que tener un Schema

//Aqui vamos a controlar los roles validos
var rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol permitido"
};

var usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"]
  },
  password: { type: String, required: [true, "La contraseña es necesaria"] },
  img: { type: String, required: false },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: rolesValidos
  },
  google: { type: Boolean, default: false }
}); //aqui se pone la configuracion del esquema que nosotros vamos a definir

usuarioSchema.plugin(uniqueValidator, {
  message: "El {PATH} debe de ser unico"
}); //aqui es donde ya usamos el plugin de unique validator

module.exports = mongoose.model("usuario", usuarioSchema);
