import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import colors from "colors";
import path from "path";
import { fileURLToPath } from "url"; // Importa fileURLToPath
import { adminRouter } from "./Routes/AdminRoute.js"; // Ajusta la ruta si es necesario
import { employeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setting
const app = express();
app.use(cookieParser());
dotenv.config();
const PORT = process.env.PORT || 8080;
const publicRoot = path.join(__dirname, "uploads");

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(publicRoot)); // Configurar la ruta estática correctamente

// Routes
app.use("/auth", adminRouter);
app.use("/employee", employeeRouter);
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) return res.json({ Status: false, Error: "Token equivocado" });
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.json({ Status: false, Error: "No Autenticado" });
  }
};
app.get("/verify", verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

// Server
const httpServer = app.listen(PORT, async () => {
  console.log(
    `Server corriendo en modo ${process.env.DEV_MODE} en puerto ${PORT}`
      .bgMagenta.white
  );
});
httpServer.on("error", (error) => console.log(`Error: ${error}`.bgRed.white));