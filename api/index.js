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

// Base de datos en memoria
let tickets = [];

// Crear ticket
app.post("/api/tickets", (req, res) => {
  try {
    const { nombre, email, evento, categoria } = req.body;
    
    if (!nombre || !email || !evento) {
      return res.status(400).json({ error: "Faltan campos" });
    }

    const codigo = "MPLA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const ticket = { 
      id: tickets.length + 1, 
      nombre, email, evento, categoria, codigo, 
      usado: false, 
      creadoEn: new Date().toISOString() 
    };
    
    tickets.push(ticket);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar tickets
app.get("/api/tickets/admin/listar", (req, res) => {
  res.json(tickets);
});

// Eliminar ticket
app.delete("/api/tickets/admin/:codigo", (req, res) => {
  const index = tickets.findIndex(t => t.codigo === req.params.codigo);
  if (index === -1) return res.status(404).json({ error: "No encontrado" });
  
  tickets.splice(index, 1);
  res.json({ mensaje: `Eliminado ${req.params.codigo}` });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", tickets: tickets.length });
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// SPA fallback - cualquier ruta no API sirve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
