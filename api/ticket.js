import { findByCodigo } from './_store.js';
export default function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  if (req.method==='OPTIONS') return res.status(200).end();
  const codigo = req.query?.codigo || (req.url||'').split('/').pop();
  if (!codigo) return res.status(400).json({ error:'Código requerido' });
  const t = findByCodigo(codigo);
  if (!t) return res.status(404).json({ error:'Ticket no encontrado' });
  return res.status(200).json(t);
}
