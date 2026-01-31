import express from "express";
import fs from "fs";

const router = express.Router();

const archivoTickets = "tickets.json";

// Cargar tickets
let tickets = [];
if (fs.existsSync(archivoTickets)) {
  tickets = JSON.parse(fs.readFileSync(archivoTickets));
}

// Guardar tickets
function guardarTickets() {
  fs.writeFileSync(archivoTickets, JSON.stringify(tickets, null, 2));
}

// Crear ticket
router.post("/", (req, res) => {
  const { nombre, email, evento, categoria } = req.body;
  const codigo = "MPLA-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const ticket = { id: tickets.length+1, nombre, email, evento, categoria, codigo, usado:false, creadoEn:new Date() };
  tickets.push(ticket);
  guardarTickets();
  res.json(ticket);
});

// Listar todos los tickets (sin adminAuth)
router.get("/admin/listar", (req, res) => {
  res.json(tickets);
});

// Eliminar ticket
router.delete("/admin/:codigo", (req, res) => {
  const index = tickets.findIndex(t => t.codigo === req.params.codigo);
  if (index === -1) return res.status(404).json({ error: "Ticket no encontrado" });
  tickets.splice(index, 1);
  guardarTickets();
  res.json({ mensaje: `Ticket ${req.params.codigo} eliminado correctamente` });
});

export default router;
