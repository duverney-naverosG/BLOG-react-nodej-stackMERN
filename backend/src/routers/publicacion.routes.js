const { obtenerPublicaciones, obtenerPublicacion, insertarPublicacion, eliminarPublicacion, actualizarPublicacion, categoriaPublicacion, obtenerPublicacionUser, obtenerUltimasPublicaciones, obtenerCategoriaCant, obtenerPublicacionRandom, obtenerPublicacionCant, obtenerPublicacionesbusqueda } = require("../controllers/publicacion.controller.js");
const { isUser } = require("../middleware/auth.jwt.js");

const router = require("express").Router();

router.get('/publicaciones', obtenerPublicaciones);

router.get('/ultimasPublicaciones', obtenerUltimasPublicaciones);

router.get('/publicacionesRecomendadas', obtenerPublicacionRandom);

router.get('/publicacionesHome', obtenerPublicacionCant);

router.get('/categoriaCant', obtenerCategoriaCant);

router.get('/publicaciones/:id', obtenerPublicacion);

router.post('/buscarPublicaciones/', obtenerPublicacionesbusqueda);

router.get('/publicacionesCategoria/:categoria', categoriaPublicacion);

router.get('/publicacionesUser', isUser, obtenerPublicacionUser);

router.post('/publicaciones', isUser,insertarPublicacion);

router.delete('/publicaciones/:id',isUser, eliminarPublicacion);

router.put('/publicaciones/:id', isUser, actualizarPublicacion);

module.exports = router;