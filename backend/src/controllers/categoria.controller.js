const categorias = require("../models/categoria.model.js");

const obtenerCategorias = async (req, res) => {
  try {
    const categoria = await categorias.find();
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const insertarCategoria = async (req, res) => {
  const { nombre } = req.body;
  if (nombre == null) {
    return res.status(400).json({ "mensaje": "llenar todo los datos" });
  }

  try {
    const categoria = await new categorias({
      nombre,
    });
    await categoria.save();
    res.status(200).json({ "mensaje": "categoria insertada" });
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    await categorias.findByIdAndDelete(req.params.id);
    res.status(200).json({ "mensaje": "categoria eliminada" });
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

module.exports = {
  obtenerCategorias,
  insertarCategoria,
  eliminarCategoria,
};
