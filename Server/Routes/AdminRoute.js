// Import
import express from "express"; // Importa Express para crear el servidor y las rutas.
import db from "../utils/db.js"; // Importa el objeto de conexión a la base de datos.
import jwt from "jsonwebtoken"; // Importa la biblioteca JSON Web Token para la autenticación.
import multer from "multer"; // Importa Multer para manejar la carga de archivos.
import path from "path"; // Módulo de Node.js para trabajar con rutas de archivos y directorios.
import fs from "fs"; // Módulo de Node.js para trabajar con el sistema de archivos.
import { fileURLToPath } from "url"; // Función para convertir una URL en una ruta de archivo.
import { dirname } from "path"; // Función para obtener el directorio de un archivo.

const __filename = fileURLToPath(import.meta.url); // Obtiene el nombre del archivo actual.
const __dirname = dirname(__filename); // Obtiene el directorio del archivo actual.

const router = express.Router(); // Crea una instancia de Router para manejar rutas específicas.

// Middleware para manejar JSON y datos de formularios
router.use(express.json()); // Middleware para parsear cuerpos de solicitud con formato JSON.
router.use(express.urlencoded({ extended: true })); // Middleware para parsear cuerpos de solicitud con formato URL-encoded.


// Configuración de multer para manejar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads"); // Define la ruta para guardar archivos.
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Crea el directorio si no existe.
    }
    cb(null, uploadPath); // Directorio donde se guardarán los archivos.
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Define el nombre del archivo.
  },
});
const upload = multer({ storage: storage }); // Inicializa Multer con la configuración de almacenamiento.

// Ruta para el login del administrador
router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err)
      return res.json({ loginStatus: false, Error: "Error de consulta" });
    if (data.length > 0) {
      const email = data[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: data[0].id },
        "jwt_secret_key",
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token); // Establece una cookie con el token JWT.
      return res.json({ loginStatus: true });
    } else {
      return res.json({
        loginStatus: false,
        Error: "Email o Password invalido",
      });
    }
  });
});

// Ruta para obtener todas las categorías
router.get("/category", (req, res) => {
  const sql = "SELECT * FROM category";
  db.query(sql, (err, data) => {
    if (err) return res.json({ Status: false, Error: "Error de consulta" });
    return res.json({ Status: true, Result: data });
  });
});

// Ruta para agregar una nueva categoría
router.post("/add_category", (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";
  db.query(sql, [req.body.category], (err, data) => {
    if (err) return res.json({ Status: false, Error: "Error de consulta" });
    return res.json({ Status: true });
  });
});

// Ruta para agregar un disco con manejo de archivos
router.post("/add_disc", upload.single("image"), (req, res) => {
  console.log("Body: ", req.body);
  console.log("File: ", req.file);

  const sql =
    "INSERT INTO disc (`banda`, `disco`, `lanzamiento`, `image`, `category_id`, `origin`, `price`) VALUES (?)";
  const values = [
    req.body.banda,
    req.body.disco,
    req.body.lanzamiento,
    req.file ? req.file.filename : null, // Usar el nombre del archivo guardado por multer.
    req.body.category_id,
    req.body.origin,
    req.body.price,
  ];
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Error de consulta: ", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Error de consulta" });
    }
    return res.json({ Status: true });
  });
});

// Ruta para obtener todos los discos con sus categorías
router.get("/disc", (req, res) => {
  const sql =
    "SELECT d.id, d.banda, d.disco, d.lanzamiento, d.image, d.origin, d.price, c.name AS category_name FROM disc d JOIN category c ON d.category_id = c.id";
  db.query(sql, (err, data) => {
    if (err) return res.json({ Status: false, Error: "Error de consulta" });
    return res.json({ Status: true, Result: data });
  });
});

// Ruta para obtener un disco por su ID
router.get("/disc/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "SELECT d.id, d.banda, d.disco, d.lanzamiento, d.image, d.origin, c.name AS category_name FROM disc d JOIN category c ON d.category_id = c.id WHERE d.id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.json({ Status: false, Error: "Error de consulta" });
    if (data.length === 0) {
      return res.json({ Status: false, Error: "Disco no encontrado" });
    }
    return res.json({ Status: true, Result: data });
  });
});

// Ruta para editar un disco
router.put("/edit_disc/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE disc SET banda = ?, disco = ?, lanzamiento = ?, category_id = ?, origin = ? WHERE id = ?";
  const values = [
    req.body.banda,
    req.body.disco,
    req.body.lanzamiento,
    req.body.category_id,
    req.body.origin,
    id,
  ];
  db.query(sql, values, (err, data) => {
    if (err) return res.json({ Status: false, Error: "Error de consulta" });
    return res.json({ Status: true });
  });
});

// Ruta para eliminar un disco
router.delete("/delete_disc/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM disc WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) return res.json({ Status: false, Error: "Error de consulta" });
    return res.json({ Status: true });
  });
});

// Ruta para obtener el conteo de bandas, eliminando duplicados por nombre
router.get("/bandas_count", (req, res) => {
  const sql = "SELECT COUNT(DISTINCT banda) AS bandas_total FROM disc";
  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ Status: false, Error: "Error de consulta" });
    }
    return res.json({ Status: true, Result: data });
  });
});

// Ruta para obtener los nombres únicos de las bandas
router.get("/bandas_records", (req, res) => {
  const sql = "SELECT DISTINCT banda AS bandas FROM disc";
  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ Status: false, Error: "Error de consulta" });
    }
    return res.json({ Status: true, Result: data });
  });
});

// Ruta para obtener el conteo de discos
router.get("/discos_count", (req, res) => {
  const sql = "SELECT COUNT(*) AS discos_total FROM disc";
  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ Status: false, Error: "Error de consulta" });
    }
    return res.json({ Status: true, Result: data });
  });
});

// Ruta para obtener el conteo de géneros
router.get("/genero_count", (req, res) => {
  const sql = "SELECT COUNT(*) AS category_total FROM category";
  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ Status: false, Error: "Error de consulta" });
    }
    return res.json({ Status: true, Result: data });
  });
});

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

// Ruta para obtener el perfil del administrador
router.get('/profile', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token no válido' });
    }

    const adminId = decoded.id;

    const sql = "SELECT id, email, photo, country, name FROM admin WHERE id = ?";
    db.query(sql, [adminId], (err, data) => {
      if (err) {
        console.error("Error de consulta: ", err);
        return res.status(500).json({ error: 'Error de consulta' });
      }

      if (data.length === 0) {
        return res.status(404).json({ error: 'Perfil de administrador no encontrado' });
      }

      const profile = {
        id: data[0].id,
        email: data[0].email,
        photo: data[0].photo,
        country: data[0].country,
        name: data[0].name
      };

      return res.json({ profile });
    });
  });
});

export { router as adminRouter }; // Exporta el enrutador para ser utilizado en otras partes de la aplicación.
