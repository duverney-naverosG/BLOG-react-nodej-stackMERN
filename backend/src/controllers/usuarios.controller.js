const usuarios = require("../models/usuarios.model.js");
const publicaciones = require("../models/publicacion.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { eliminarRuta } = require("../helpers/elimnarImagen.js");

const obtenerUsuario = async (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
  const user = jwt.verify(token, process.env.KEY_SECRET);
  try {
    const usuario = await usuarios.findById(user.id);

    if (!usuario) {
      return res.status(500).json({ "mensaje": "usuario no encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const actualizarUsuario = async (req, res) => {
  const { nombre, username, correo, telefono, foto, passwordM } = req.body;
  if (nombre == null || username == null || correo == null || telefono == null) {
    return res.status(400).json({ "mensaje": "llenar todo los datos" });
  }

  const token = req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
  const user = jwt.verify(token, process.env.KEY_SECRET);
  try {
    const usuario = await usuarios.findById(user.id);
    if (passwordM) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(passwordM, salt);
      await usuarios.findByIdAndUpdate(user.id, {
        nombre,
        username,
        correo,
        telefono,
        foto,
        password: hashedPass,
      });
    } else {
      await usuarios.findByIdAndUpdate(user.id, {
        nombre,
        username,
        correo,
        telefono,
        foto,
      });
    }

    if (foto !== usuario.foto && foto !== undefined) {
      if (usuario.foto) {
        eliminarRuta(usuario.foto);
      }
    }


    const userModif = await usuarios.findById(user.id);
    const { password, ...others } = userModif._doc;

    res.status(200).json({ "usuarios": others, token: token });

  } catch (error) {
    console.log(error)
    res.status(500).json({ "mensaje": error });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const token = req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
    const user = jwt.verify(token, process.env.KEY_SECRET);
    const usuario = await usuarios.findByIdAndDelete(user.id);

    const publicacion = await publicaciones.find({
      "usuario.id": user.id,
    });

    const idPublicaciones = publicacion.map((publicacion) => publicacion._id);
    const fotosPublicaciones = publicacion.map(
      (publicacion) => publicacion.foto
    );
    await publicaciones.deleteMany({ _id: { $in: idPublicaciones } });
    eliminarRuta(usuario.foto);

    for (let i = 0; i < fotosPublicaciones.length; i++) {
      eliminarRuta(fotosPublicaciones[i]);
    }
    res.status(200).json({ "mensaje": "usuario eliminado" });
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

module.exports = {
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
