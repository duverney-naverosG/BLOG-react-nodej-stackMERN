const { Schema, model } = require("mongoose");

const publicacionShema = new Schema(
  {
    titulo: {
      type: String,
      require: true,
      trim: true,
    },
    descripcion: {
      type: String,
      require: true,
      trim: true,
    },
    foto: {
      type: String,
      require: true,
      trim: true,
    },
    usuario:{
      type: Array,
    },
    categoria: {
      type: Array,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("publicaciones", publicacionShema);
