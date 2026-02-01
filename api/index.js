import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas API
import("./backend/routes/tickets.js").then(({ default: ticketsRoutes }) => {
  app.use("/api/tickets", ticketsRoutes);
}).catch(error => console.error("Error importing routes:", error));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "backend", "public")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "backend", "public", "index.html"));
});

export default app;
