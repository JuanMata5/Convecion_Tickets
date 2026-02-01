import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import ticketsRoutes from "./backend/routes/tickets.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

// Usar rutas API
app.use("/api/tickets", ticketsRoutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "backend", "public")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "backend", "public", "index.html"));
});

export default app;
