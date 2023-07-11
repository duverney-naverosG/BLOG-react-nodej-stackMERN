const { eliminarRuta } = require("../helpers/elimnarImagen");
const publicaciones = require("../models/publicacion.model");
const usuarios = require("../models/usuarios.model.js");
const categorias = require("../models/categoria.model.js");
const jwt = require("jsonwebtoken");

const obtenerPublicaciones = async (req, res) => {
  try {
    const publicacion = await publicaciones.find().sort({ $natural: -1 });
    res.status(200).json(publicacion);
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const obtenerUltimasPublicaciones = async (req, res) => {
  const publicacionesU = []
  try {
    const publicacion = await publicaciones.find().sort({ $natural: -1 });
    for (let i = 0; i < 5; i++) {
      publicacionesU.push(publicacion[i]);
    }
    res.status(200).json(publicacionesU);
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const obtenerCategoriaCant = async (req, res) => {
  const publicacionesU = []
  try {
    const publicacion = await publicaciones.find().sort({ $natural: -1 });
    const categoria = await categorias.find();
    for (let i = 0; i < categoria.length; i++) {
      publicacionesU.push({ "nombre": categoria[i].nombre, "cant": 0 })
      for (let j = 0; j < publicacion.length; j++) {
        if (publicacion[j].categoria[0] === categoria[i].nombre) {
          publicacionesU[i].cant++
        }
      }
    }
    res.status(200).json(publicacionesU);
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const obtenerPublicacionCant = async (req, res) => {
  const publicacionesU = []
  let cant = 0
  try {
    const publicacion = await publicaciones.find().sort({ $natural: -1 });
    const categoria = await categorias.find();
    for (let i = 0; i < categoria.length; i++) {
      publicacionesU.push({ "nombre": categoria[i].nombre, "cant": [] })
      for (let j = 0; j < publicacion.length; j++) {
        if (publicacion[j].categoria[0] === categoria[i].nombre && cant < 3) {
          publicacionesU[i].cant.push(publicacion[j])
          cant++
        }
      }
      cant = 0;
    }
    res.status(200).json(publicacionesU);
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const obtenerPublicacionRandom = async (req, res) => {
  const publicacionesU = []
  const randoUnico = []
  try {
    const publicacion = await publicaciones.find().sort({ $natural: -1 });
    while(randoUnico.length < 4) {
      let random = Math.floor((Math.random()*(publicacion.length - 0 + 1)) + 0)
      if(!randoUnico.includes(random)){
        publicacionesU.push(publicacion[random]);
        randoUnico.push(random)
      }
    }
    res.status(200).json(publicacionesU);
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const obtenerPublicacion = async (req, res) => {
  try {
    const publicacion = await publicaciones.findById(req.params.id);
    if (!publicacion) {
      return res.status(500).json({ "mensaje": "publicacion no encontrada" });
    }
    res.status(200).json(publicacion);
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const obtenerPublicacionesbusqueda = async (req, res) => {
  const publicacionesB = []
  try {
    const publicacion = await publicaciones.find().sort({ $natural: -1 });
    publicacion.map((publicacion)=>{
      if(publicacion.titulo.includes(req.body.titulo)){
        publicacionesB.push(publicacion)
      }
    })
    res.status(200).json(publicacionesB);
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const obtenerPublicacionUser = async (req, res) => {
  try {
    const token = req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
    const user = jwt.verify(token, process.env.KEY_SECRET);
    const publicacion = await publicaciones.find().sort({ $natural: -1 });
    const publicacionUser = publicacion.filter((publicacion) => {
      if (publicacion.usuario[0] == user.id) {
        return publicacion;
      }
    });
    res.status(200).json(publicacionUser);
  } catch (error) {
    res.status(200).json({ "mensaje": error });
  }
};

const insertarPublicacion = async (req, res) => {
  const { titulo, descripcion, foto, categoria } = req.body;
  if (titulo == null || descripcion == null || categoria.length <= 0) {
    return res.status(400).json({ "mensaje": "llenar todo los datos" });
  }

  const token = req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
  const user = jwt.verify(token, process.env.KEY_SECRET);
  const usuario = await usuarios.findById(user.id);
  try {
    const publicacion = new publicaciones({
      titulo,
      descripcion,
      foto,
      categoria,
      usuario: [usuario._id, usuario.username, usuario.foto, usuario.nombre, usuario.telefono],
    });

    await publicacion.save();
    res.status(200).json({ "mensaje": "publicacion insertado" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const actualizarPublicacion = async (req, res) => {
  const { titulo, descripcion, foto, categoria } = req.body;
  console.log(req.body)
  if (titulo == null || descripcion == null || foto == null || categoria.length <= 0) {
    return res.status(400).json({ "mensaje": "llenar todo los datos" });
  }

  const token = req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
  const user = jwt.verify(token, process.env.KEY_SECRET);
  try {
    const publicacionA = await publicaciones.findById(req.params.id);

    if (publicacionA.usuario[0] == user.id) {
      await publicaciones.findByIdAndUpdate(req.params.id, {
        titulo,
        descripcion,
        foto,
        categoria,
      });

      if (publicacionA.foto != foto) {
        eliminarRuta(publicacionA.foto);
      }

      return res.status(200).json({ "mensaje": "publicacion actualizada" });
    }

    res.status(502).json({ "mensaje": "publicacion no corresponde con el autor" });
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const eliminarPublicacion = async (req, res) => {
  try {
    const token = req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
    const user = jwt.verify(token, process.env.KEY_SECRET);
    const publicacionA = await publicaciones.findById(req.params.id);

    if (publicacionA.usuario[0] == user.id) {
      const publicacion = await publicaciones.findByIdAndDelete(req.params.id);
      if (publicacionA.foto) {
        eliminarRuta(publicacion.foto);
      }

      return res.status(200).json({ "mensaje": "publicacion eliminada" });
    }

    res.status(500).json({ "mensaje": "publicacion no corresponde con el autor" });
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

const categoriaPublicacion = async (req, res) => {
  try {
    const publicacion = await publicaciones.find({ categoria: { $in: req.params.categoria } }).sort({ $natural: -1 });

    if (publicacion.length <= 0) {
      return res.status(500).json({
        "mensaje": "no hay publicaciones con la categoria seleccionada",
      });
    }
    res.status(200).json(publicacion);
  } catch (error) {
    res.status(500).json({ "mensaje": error });
  }
};

module.exports = {
  obtenerPublicaciones,
  obtenerUltimasPublicaciones,
  obtenerCategoriaCant,
  obtenerPublicacionRandom,
  obtenerPublicacionCant,
  obtenerPublicacion,
  obtenerPublicacionUser,
  obtenerPublicacionesbusqueda,
  insertarPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
  categoriaPublicacion,
};
