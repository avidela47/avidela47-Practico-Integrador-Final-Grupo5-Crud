// Este código establece una conexión con una base de datos MySQL utilizando la biblioteca mysql para Node.js. Configura la conexión con los parámetros necesarios (host, usuario, contraseña y base de datos) y maneja los posibles errores de conexión, mostrando mensajes coloreados en la consola gracias a la biblioteca colors. Finalmente, exporta el objeto de conexión para que pueda ser utilizado en otras partes de la aplicación.

import mysql from "mysql"; // Importa la biblioteca MySQL para Node.js, que permite interactuar con bases de datos MySQL.
import colors from "colors"; // Importa la biblioteca colors para dar color al texto en la consola.

const db = mysql.createConnection({
  host: "localhost", // Dirección del servidor MySQL.
  user: "root", // Nombre de usuario para conectarse a la base de datos.
  password: "avidela", // Contraseña para conectarse a la base de datos.
  database: "vinyl_record", // Nombre de la base de datos a la que se conecta.
});

db.connect(function (err) {
  if (err) {
    console.log(`Error Connected to MySQL database`.bgRed); // Muestra un mensaje en rojo si hay un error al conectar.
  } else {
    console.log(`Connected to MySQL database`.bgBlue); // Muestra un mensaje en azul si la conexión es exitosa.
  }
});

export default db; // Exporta el objeto de conexión a la base de datos para que pueda ser utilizado en otros módulos.

