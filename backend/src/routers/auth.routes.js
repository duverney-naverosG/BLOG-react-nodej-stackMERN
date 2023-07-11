const { login, insertarUsuario, insertarAdmin } = require("../controllers/auth.controller.js");
const { isAdmin } = require("../middleware/auth.jwt.js");

const router = require("express").Router();

router.post('/register/usuarios/', insertarUsuario);

router.post('/register/admin/', isAdmin, insertarAdmin);

router.post('/login', login);


module.exports = router;