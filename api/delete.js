import { deleteByCodigo } from './_store.js';
export default function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','DELETE,OPTIONS');
  if (req.method==='OPTIONS') return res.status(200).end();
  if (req.method!=='DELETE') return res.status(405).json({ error:'Method not allowed' });
  const codigo = req.query?.codigo;
  if (!codigo) return res.status(400).json({ error:'Código requerido' });
  const ok = deleteByCodigo(codigo);
  if (!ok) return res.status(404).json({ error:'Ticket no encontrado' });
  return res.json({ mensaje: `Ticket ${codigo} eliminado` });
}
