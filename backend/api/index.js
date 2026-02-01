import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas
try {
  const { default: ticketsRoutes } = await import("../routes/tickets.js");
  app.use("/api/tickets", ticketsRoutes);
} catch (error) {
  console.error("Error importing tickets routes:", error);
}

// Servir la carpeta public
app.use(express.static(path.join(__dirname, "../public")));

// Middleware para SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

export default app;
