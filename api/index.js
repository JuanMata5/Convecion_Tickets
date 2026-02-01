import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Base de datos en memoria
let tickets = [];

// ============ API ENDPOINTS ============

// Crear ticket
app.post("/api/tickets", (req, res) => {
  try {
    const { nombre, email, evento, categoria } = req.body;

    if (!nombre || !email || !evento) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const codigo = "MPLA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const ticket = {
      id: tickets.length + 1,
      nombre,
      email,
      evento,
      categoria,
      codigo,
      usado: false,
      creadoEn: new Date().toISOString()
    };

    tickets.push(ticket);
    return res.status(201).json(ticket);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Listar tickets
app.get("/api/tickets/admin/listar", (req, res) => {
  return res.status(200).json(tickets);
});

// Eliminar ticket
app.delete("/api/tickets/admin/:codigo", (req, res) => {
  try {
    const index = tickets.findIndex(t => t.codigo === req.params.codigo);
    if (index === -1) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    tickets.splice(index, 1);
    return res.json({ mensaje: `Ticket ${req.params.codigo} eliminado correctamente` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  return res.json({ status: "ok", tickets: tickets.length });
});

// ============ STATIC FILES ============

app.use(express.static(path.join(__dirname, "../public")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
