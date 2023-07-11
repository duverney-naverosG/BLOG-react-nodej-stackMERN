const bcrypt = require("bcrypt");
const usuarios = require("../models/usuarios.model.js");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();

const login = async (req, res) => {
  try {
    const usuario = await usuarios.findOne({ username: req.body.username });
    if (!usuario) {
      return res.status(404).json("credenciales equivocadas!");
    }
    
    const validacion = await bcrypt.compare(
      req.body.password,
      usuario.password
    );

    if (!validacion) {
      return res.status(400).json("credenciales equivocadas!");
    }

    const token = jwt.sign({ id: usuario._id }, process.env.KEY_SECRET, {
      expiresIn: 60 * 60,
    });

    const { password, ...others } = usuario._doc;

    res.status(200).json({"usuarios":others, token: token});
  } catch (err) {
    res.status(500).json(err);
  }
};

const insertarUsuario = async (req, res) => {
  const { nombre, username, correo, telefono, password, foto } = req.body;
  if (nombre == null || username == null || correo == null || telefono == null || password == null ) {
    return res.status(404).json({ "mensaje": "llenar todo los datos" });
  }

  try {
    const user = await usuarios.find({ username: username });
    
    if (user.length > 0) {
      return res.status(400).json({ "mensaje": "username ya registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const usuario = new usuarios({
      nombre,
      username,
      correo,
      telefono,
      foto,
      password: hashedPass,
    });

    await usuario.save();

    res.status(200).json({'mensaje': 'usuario registrado'});
  } catch (err) {
    res.status(500).json(err);
  }

};

const insertarAdmin = async (req, res) => {
  const { nombre, username, correo, telefono, password, foto, rol } = req.body;

  if (nombre == null || username == null || correo == null || telefono == null || password == null || foto == null, rol == null) {
    return res.status(400).json({ "mensaje": "llenar todo los datos" });
  }

  try {
    const user = await usuarios.find({ username });

    if (!user) {
      return res.status(500).json({ "mensaje": "username ya registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const usuario = new usuarios({
      nombre,
      username,
      correo,
      telefono,
      foto,
      rol,
      password: hashedPass,
    });

    const userId = await usuario.save();
    const token = jwt.sign({ id: userId._id }, process.env.KEY_SECRET, {
      expiresIn: 60 * 60,
    });

    res.status(200).json(token);
  } catch (err) {
    res.status(500).json(err);
  }
};


module.exports = {
  login,
  insertarAdmin,
  insertarUsuario
};
