// Esta estructura proporciona una base sólida para un servidor Node.js con Express, gestionando rutas, autenticación con JWT, y configuración de variables de entorno.

// Import
import express from "express"; // Framework para crear servidores web y APIs.
import cors from "cors"; // Middleware para habilitar CORS (Cross-Origin Resource Sharing).
import * as dotenv from "dotenv"; // Biblioteca para cargar variables de entorno desde un archivo .env.
import colors from "colors"; // Biblioteca para dar color al texto en la consola.
import path from "path"; // Módulo de Node.js para trabajar con rutas de archivos y directorios.
import { fileURLToPath } from "url"; // Función para convertir una URL en una ruta de archivo.
import { adminRouter } from "./Routes/AdminRoute.js"; // Importa las rutas del administrador.
import { employeeRouter } from "./Routes/EmployeeRoute.js"; // Importa las rutas de los empleados.
import Jwt from "jsonwebtoken"; // Biblioteca para trabajar con JSON Web Tokens.
import cookieParser from "cookie-parser"; // Middleware para parsear cookies.


// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url); // Obtiene el nombre del archivo actual.
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual.

// Setting
const app = express(); // Inicializa una aplicación de Express.
app.use(cookieParser()); // Usa el middleware para parsear cookies.
dotenv.config(); // Carga las variables de entorno desde el archivo .env.
const PORT = process.env.PORT || 8080; // Establece el puerto desde las variables de entorno o usa el 8080 por defecto.
const publicRoot = path.join(__dirname, "uploads"); // Define la ruta de la carpeta pública para archivos estáticos.

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"], // Define los orígenes permitidos.
    methods: ["GET", "POST", "PUT", "DELETE"], // Define los métodos HTTP permitidos.
    credentials: true, // Permite el uso de credenciales (cookies, cabeceras de autorización, etc.).
  })
);
app.use(express.json()); // Middleware para parsear cuerpos de solicitud con formato JSON.
app.use(express.urlencoded({ extended: true })); // Middleware para parsear cuerpos de solicitud con formato URL-encoded.
app.use("/uploads", express.static(publicRoot)); // Sirve archivos estáticos desde la carpeta "uploads".

// Routes
app.use("/auth", adminRouter); // Usa las rutas del administrador en la ruta base /auth.
app.use("/employee", employeeRouter); // Usa las rutas de los empleados en la ruta base /employee.

const verifyUser = (req, res, next) => {
  const token = req.cookies.token; // Obtiene el token de las cookies.
  if (token) {
    Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) return res.json({ Status: false, Error: "Token equivocado" }); // Maneja el error de verificación.
      req.id = decoded.id; // Almacena el id decodificado en la solicitud.
      req.role = decoded.role; // Almacena el rol decodificado en la solicitud.
      next(); // Pasa al siguiente middleware.
    });
  } else {
    return res.json({ Status: false, Error: "No Autenticado" }); // Responde con un error si no hay token.
  }
};

app.get("/verify", verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id }); // Ruta protegida que verifica al usuario.
});

// Server
const httpServer = app.listen(PORT, async () => {
  console.log(
    `Server corriendo en modo ${process.env.DEV_MODE} en puerto ${PORT}`
      .bgMagenta.white // Muestra un mensaje en la consola con el modo de desarrollo y el puerto, en color.
  );
});

httpServer.on("error", (error) => console.log(`Error: ${error}`.bgRed.white)); // Maneja errores del servidor.
