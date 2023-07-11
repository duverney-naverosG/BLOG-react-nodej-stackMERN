const {obtenerCategorias, insertarCategoria, eliminarCategoria} = require('../controllers/categoria.controller.js');
const { isAdmin } = require('../middleware/auth.jwt.js');
const router = require("express").Router();

router.get('/categorias', obtenerCategorias);

router.post('/categorias', isAdmin ,insertarCategoria);

router.delete('/categorias/:id', isAdmin, eliminarCategoria);

module.exports = router;