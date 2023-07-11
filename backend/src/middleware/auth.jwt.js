const jwt = require("jsonwebtoken");
const usuarios = require("../models/usuarios.model.js");
const { config } = require("dotenv");
config();

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(400).json({ "mensaje": "se necesita pasar un token - login" });
    }
    
    const user = jwt.verify(token, process.env.KEY_SECRET);
    if (!user) {
      return res.status(502).json({ "mensaje": "usuario no registrado" });
    }
    
    const usuario = await usuarios.findById(user.id);
    if (!usuario) {
      return res.status(502).json({ "mensaje": "usuario no registrado" });
    }
    if (usuario.rol == "admin") {
      next();
    } else {
      return res.status(503).json({ "mensaje": "no tiene los permisos" });
    }
  } catch (error) {
    res.status(505).json({ "mensaje": error });
  }
};

const isUser = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(400).json({ "mensaje": "se necesita pasar un token - login" });
    }
    
    const user = jwt.verify(token, process.env.KEY_SECRET);
    if (!user) {
      return res.status(502).json({ "mensaje": "usuario no registrado" });
    }
    const usuario = await usuarios.findById(user.id);
    if (!usuario) {
      return res.status(502).json({ "mensaje": "usuario no registrado" });
    }
      
    next();
  } catch (error) {
    res.status(505).json({ "mensaje": error });
  }
};

module.exports = {
  isAdmin,
  isUser,
};
