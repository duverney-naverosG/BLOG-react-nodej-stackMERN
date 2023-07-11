const { Schema, model } = require("mongoose");

const categoriaShema = new Schema(
  {
    nombre: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model("categorias", categoriaShema);
