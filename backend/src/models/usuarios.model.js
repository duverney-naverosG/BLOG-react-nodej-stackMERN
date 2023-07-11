const { Schema, model } = require("mongoose");

const usuarioShema = new Schema(
  {
    nombre: {
      type: String,
      require: true,
      trim: true,
    },
    username: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    correo: {
      type: String,
      require: true,
      trim: true,
    },
    telefono: {
      type: Number,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    foto: {
      type: String,
      require: true,
      trim: true,
    },
    rol: {
      type: String,
      trim: true,
      default: "usuario"
    }
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports= model("usuarios", usuarioShema);
