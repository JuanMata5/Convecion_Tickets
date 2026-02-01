import { addTicket } from './_store.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      const { nombre, email, evento, categoria } = req.body || {};
      if (!nombre || !email || !evento) return res.status(400).json({ error: 'Faltan campos' });
      const codigo = 'MPLA-' + Math.random().toString(36).substring(2,8).toUpperCase();
      const ticket = { id: Date.now(), nombre, email, evento, categoria, codigo, usado:false, creadoEn: new Date().toISOString() };
      addTicket(ticket);
      return res.status(201).json(ticket);
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  res.status(405).json({ error: 'Método no permitido' });
}
