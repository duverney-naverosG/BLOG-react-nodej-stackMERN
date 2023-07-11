const path = require("path");
const fs = require("fs");

const eliminarRuta = (foto) => {
  let ruta = path.join(__dirname).split(path.sep);

  ruta.pop();

  let rutafinal = "";
  
  for (let i = 0; i < ruta.length; i++) {
    rutafinal += ruta[i];
    rutafinal += path.sep;
  }
  fs.unlinkSync(rutafinal + "public" + path.sep + "images" + path.sep + foto);
};

module.exports = {
  eliminarRuta,
};
