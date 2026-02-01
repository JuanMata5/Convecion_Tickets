import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let tickets = [];

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Obtener ruta: req.url puede venir como "/ticket.html?codigo=..." o solo "/ticket.html"
  let urlPath = req.url.split('?')[0]; // Remover query string
  
  if (urlPath === '' || urlPath === '/') {
    urlPath = '/index.html';
  }

  const filePath = path.join(__dirname, '../public', urlPath);
  
  try {
    // Verificar que el archivo existe y es un archivo (no directorio)
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      const content = fs.readFileSync(filePath);
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      return res.status(200).send(content);
    }
  } catch (e) {
    // Archivo no existe, servir index.html (SPA fallback)
  }

  // SPA fallback: cualquier ruta que no existe sirve index.html
  try {
    const indexPath = path.join(__dirname, '../public/index.html');
    const content = fs.readFileSync(indexPath);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(content);
  } catch (e) {
    return res.status(404).json({ error: 'Not found' });
  }
}
