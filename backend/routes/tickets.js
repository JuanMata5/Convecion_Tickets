import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Base de datos en memoria (se reinicia con cada deploy)
let tickets = [];

// Ruta al archivo (solo lectura en Vercel, pero intenta guardar localmente)
const archivoTickets = path.join(__dirname, "../tickets.json");

// Cargar tickets al iniciar
function cargarTickets() {
  try {
    if (fs.existsSync(archivoTickets)) {
      const data = fs.readFileSync(archivoTickets, "utf8");
      tickets = JSON.parse(data);
      console.log(`Cargados ${tickets.length} tickets desde archivo`);
    }
  } catch (error) {
    console.error("Error leyendo tickets.json:", error.message);
    tickets = [];
  }
}

// Guardar tickets (intenta escribir, pero en Vercel fallará)
function guardarTickets() {
  try {
    // Solo intenta guardar, si falla no importa
    fs.writeFileSync(archivoTickets, JSON.stringify(tickets, null, 2), "utf8");
  } catch (error) {
    console.warn("No se pudo guardar tickets.json (normal en Vercel):", error.message);
  }
}

// Cargar al inicializar el router
cargarTickets();

// Crear ticket
router.post("/", (req, res) => {
  try {
    const { nombre, email, evento, categoria } = req.body;
    
    if (!nombre || !email || !evento || !categoria) {
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
    guardarTickets();
    
    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creando ticket:", error);
    res.status(500).json({ error: error.message });
  }
});

// Listar todos los tickets
router.get("/admin/listar", (req, res) => {
  try {
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar ticket
router.delete("/admin/:codigo", (req, res) => {
  try {
    const index = tickets.findIndex(t => t.codigo === req.params.codigo);
    
    if (index === -1) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    
    const eliminado = tickets.splice(index, 1)[0];
    guardarTickets();
    
    res.json({ 
      mensaje: `Ticket ${req.params.codigo} eliminado correctamente`,
      ticket: eliminado 
    });
  } catch (error) {
    console.error("Error eliminando ticket:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
