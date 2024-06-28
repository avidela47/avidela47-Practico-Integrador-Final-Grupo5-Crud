// Import
import express from "express"; // Importa Express para crear el servidor y las rutas.
import db from "../utils/db.js"; // Importa el objeto de conexión a la base de datos.
import jwt from "jsonwebtoken"; // Importa la biblioteca JSON Web Token para la autenticación.
import bcrypt from "bcrypt"; // Importa la biblioteca bcrypt para el hashing de contraseñas.

const router = express.Router(); // Crea una instancia de Router para manejar rutas específicas.

// Hashear la contraseña antes de insertarla en la base de datos
// const saltRounds = 10; // Define el número de rondas de sal para bcrypt.
// const plainTextPassword = "1234"; // Contraseña en texto plano que se quiere hashear.
// bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
//   if (err) {
//     console.error("Error al hashear la contraseña:", err); // Manejo de errores durante el hashing.
//   } else {
//     console.log("Contraseña hasheada:", hash); // Muestra la contraseña hasheada.
//     // Inserta el hash en la base de datos
//   }
// });

router.post("/employee_login", (req, res) => {
  const sql = "SELECT * FROM employee WHERE email = ?"; // Consulta SQL para seleccionar el empleado por su email.
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ loginStatus: false, Error: "Error de consulta" }); // Manejo de error en la consulta.

    if (data.length > 0) {
      const storedPassword = data[0].password; // Contraseña almacenada en la base de datos.
      const enteredPassword = req.body.password; // Contraseña ingresada por el usuario.

      console.log("Stored Password:", storedPassword);
      console.log("Entered Password:", enteredPassword);

      bcrypt.compare(enteredPassword, storedPassword, (err, result) => { // Compara las contraseñas.
        if (err) {
          console.log("Error en la comparación de contraseñas:", err); // Manejo de error en la comparación.
          return res.json({
            loginStatus: false,
            Error: "Error en la comparación de contraseñas",
          });
        }
        if (!result) {
          return res.json({ loginStatus: false, Error: "Password invalido" }); // Contraseña no coincide.
        }

        const email = data[0].email;
        const token = jwt.sign(
          { role: "employee", email: email, id: data[0].id }, // Información contenida en el token.
          "jwt_secret_key", // Clave secreta para firmar el token.
          {
            expiresIn: "1d", // El token expira en un día.
          }
        );

        res.cookie("token", token); // Establece una cookie con el token JWT.
        return res.json({ loginStatus: true, id: data[0].id }); // Respuesta de éxito.
      });
    } else {
      return res.json({
        loginStatus: false,
        Error: "Email o Password invalido", // Usuario no encontrado o contraseña incorrecta.
      });
    }
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token"); // Elimina la cookie del token JWT.
  return res.json({ Status: true }); // Respuesta de éxito.
});

export { router as employeeRouter }; // Exporta el enrutador para ser utilizado en otras partes de la aplicación.

