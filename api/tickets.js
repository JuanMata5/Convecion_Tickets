// Base de datos compartida en memoria
export let tickets = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { nombre, email, evento, categoria } = req.body;

    if (!nombre || !email || !evento) {
      return res.status(400).json({ error: 'Faltan campos' });
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
  }

  res.status(405).json({ error: 'Method not allowed' });
}
