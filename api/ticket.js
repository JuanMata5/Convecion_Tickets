import { tickets } from './tickets.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Obtener ticket por código desde la URL: /api/ticket/CODIGO o /api/ticket?codigo=CODIGO
    let codigo = req.query.codigo || req.url.split('/').pop();
    
    if (!codigo) {
      return res.status(400).json({ error: 'Código requerido' });
    }

    // Buscar el ticket
    const ticket = tickets.find(t => t.codigo === codigo);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    return res.status(200).json(ticket);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
