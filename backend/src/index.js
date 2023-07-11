const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { config } = require("dotenv");
config();

//CONEXION A LA BASE DE DATOS
require("./database/conexion.js");

const categoriasRouter = require("./routers/categoria.routes.js");
const publicacionesRouter = require("./routers/publicacion.routes.js");
const usuariosRouter = require("./routers/usuarios.routes.js");
const authRouter = require("./routers/auth.routes.js");

const app = express();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/images"),
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//MIDDEWALE
app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); //uso de json
app.use(express.urlencoded({ extended: true })); //uso de datos

const upload = multer({
  storage: storage,
  dest: path.join(__dirname, "public/images"),
  limits: { fieldSize: 35000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const typeImage = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname));
    if (typeImage && extName) {
      return cb(null, true);
    }
    cb("error: el arhivo debe ser una imagen y pesar menos de 35M");
  },
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api", authRouter);
app.use("/api", categoriasRouter);
app.use("/api", publicacionesRouter);
app.use("/api", usuariosRouter);
// app.use("/", (req, res) => {
//   res.render("index");
// });

//ARCHIVOS ESTATICOS
app.use(express.static(path.join(__dirname, "/public/")));

//PUERTO Y LEVATAMIENTO DEL SERVIDOR
app.listen(process.env.PORT, () => {
  console.log("Backend arrancado.");
});