const { isUser } = require("../middleware/auth.jwt");
const { obtenerUsuario, eliminarUsuario, actualizarUsuario } = require("../controllers/usuarios.controller");

const router = require("express").Router();

router.get('/usuario', isUser, obtenerUsuario);

router.delete('/usuario', isUser, eliminarUsuario);

router.put('/usuario', isUser, actualizarUsuario);

module.exports = router;