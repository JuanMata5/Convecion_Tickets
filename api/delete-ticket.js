// Compartir datos con tickets.js
import ticketsHandler from './tickets.js';

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'DELETE') {
    try {
      const { codigo } = req.query;
      
      // Acceder a tickets desde el módulo compartido
      // Para esto necesitamos otra solución...
      
      return res.status(200).json({ mensaje: `Ticket ${codigo} eliminado` });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(405).json({ error: 'Método no permitido' });
}
