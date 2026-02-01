import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// ============ BASE DE DATOS ============
let tickets = [];

// ============ API ENDPOINTS ============

// POST: Crear ticket
app.post('/api/tickets', (req, res) => {
  try {
    const { nombre, email, evento, categoria } = req.body;

    if (!nombre || !email || !evento) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const codigo = 'MPLA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
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

// GET: Listar todos los tickets
app.get('/api/listar', (req, res) => {
  return res.status(200).json(tickets);
});

// GET: Obtener ticket por código
app.get('/api/ticket', (req, res) => {
  const { codigo } = req.query;
  
  if (!codigo) {
    return res.status(400).json({ error: 'Código requerido' });
  }

  const ticket = tickets.find(t => t.codigo === codigo);
  
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket no encontrado' });
  }

  return res.status(200).json(ticket);
});

// DELETE: Eliminar ticket
app.delete('/api/delete', (req, res) => {
  const { codigo } = req.query;
  
  if (!codigo) {
    return res.status(400).json({ error: 'Código requerido' });
  }

  const index = tickets.findIndex(t => t.codigo === codigo);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Ticket no encontrado' });
  }

  tickets.splice(index, 1);
  return res.json({ mensaje: `Ticket ${codigo} eliminado` });
});

// ============ STATIC FILES ============
app.use(express.static(path.join(__dirname, '../public')));

// SPA fallback - cualquier otra ruta que no sea /api
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
