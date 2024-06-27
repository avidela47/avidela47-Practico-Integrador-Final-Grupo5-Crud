import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import colors from "colors";
import path from "path";
import { fileURLToPath } from "url";
import { adminRouter } from "./Routes/AdminRoute.js";
import { employeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicRoot = path.join(__dirname, "uploads");
app.use("/uploads", express.static(publicRoot));

// Verificar rutas y middlewares
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

// Asegúrate de que esta ruta está después del middleware de verificación
app.get("/verify", verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

const httpServer = app.listen(PORT, async () => {
  console.log(`Server corriendo en modo ${process.env.DEV_MODE} en puerto ${PORT}`.bgMagenta.white);
});

httpServer.on("error", (error) => console.log(`Error: ${error}`.bgRed.white));
