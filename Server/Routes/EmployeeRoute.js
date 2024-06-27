import express from "express";
import db from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

// Hashear la contraseña antes de insertarla en la base de datos
// const saltRounds = 10;
// const plainTextPassword = "1234";
// bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
//   if (err) {
//     console.error("Error al hashear la contraseña:", err);
//   } else {
//     console.log("Contraseña hasheada:", hash);
// Inserta el hash en la base de datos
//   }
// });

router.post("/employee_login", (req, res) => {
  const sql = "SELECT * FROM employee WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err)
      return res.json({ loginStatus: false, Error: "Error de consulta" });

    if (data.length > 0) {
      const storedPassword = data[0].password;
      const enteredPassword = req.body.password;

      console.log("Stored Password:", storedPassword);
      console.log("Entered Password:", enteredPassword);

      bcrypt.compare(enteredPassword, storedPassword, (err, result) => {
        if (err) {
          console.log("Error en la comparación de contraseñas:", err);
          return res.json({
            loginStatus: false,
            Error: "Error en la comparación de contraseñas",
          });
        }
        if (!result) {
          return res.json({ loginStatus: false, Error: "Password invalido" });
        }

        const email = data[0].email;
        const token = jwt.sign(
          { role: "employee", email: email, id: data[0].id },
          "jwt_secret_key",
          {
            expiresIn: "1d",
          }
        );

        res.cookie("token", token);
        return res.json({ loginStatus: true, id: data[0].id }); // Use data[0].id here
      });
    } else {
      return res.json({
        loginStatus: false,
        Error: "Email o Password invalido",
      });
    }
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as employeeRouter };
