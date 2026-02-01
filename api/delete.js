import { tickets } from './tickets.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'DELETE') {
    const { codigo } = req.query;
    const index = tickets.findIndex(t => t.codigo === codigo);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    tickets.splice(index, 1);
    return res.json({ mensaje: `Ticket ${codigo} eliminado` });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
