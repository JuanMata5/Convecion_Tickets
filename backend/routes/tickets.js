import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Usar ruta absoluta para tickets.json
const archivoTickets = path.join(__dirname, "../tickets.json");

// Cargar tickets
let tickets = [];
if (fs.existsSync(archivoTickets)) {
  try {
    tickets = JSON.parse(fs.readFileSync(archivoTickets, "utf8"));
  } catch (error) {
    console.error("Error reading tickets.json:", error);
    tickets = [];
  }
}

// Guardar tickets
function guardarTickets() {
  try {
    fs.writeFileSync(archivoTickets, JSON.stringify(tickets, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing tickets.json:", error);
  }
}

// Crear ticket
router.post("/", (req, res) => {
  try {
    const { nombre, email, evento, categoria } = req.body;
    const codigo = "MPLA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const ticket = { id: tickets.length+1, nombre, email, evento, categoria, codigo, usado:false, creadoEn:new Date() };
    tickets.push(ticket);
    guardarTickets();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar todos los tickets (sin adminAuth)
router.get("/admin/listar", (req, res) => {
  res.json(tickets);
});

// Eliminar ticket
router.delete("/admin/:codigo", (req, res) => {
  try {
    const index = tickets.findIndex(t => t.codigo === req.params.codigo);
    if (index === -1) return res.status(404).json({ error: "Ticket no encontrado" });
    tickets.splice(index, 1);
    guardarTickets();
    res.json({ mensaje: `Ticket ${req.params.codigo} eliminado correctamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
