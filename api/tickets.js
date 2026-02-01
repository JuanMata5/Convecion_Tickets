// Base de datos en memoria compartida
let tickets = [];

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Crear ticket
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
  }

  if (req.method === 'GET') {
    // Listar todos los tickets
    return res.status(200).json(tickets);
  }

  res.status(405).json({ error: 'Método no permitido' });
}
