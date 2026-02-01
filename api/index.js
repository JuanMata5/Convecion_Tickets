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

  // Obtener la ruta sin query string
  let urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  
  if (urlPath === '/') {
    urlPath = '/index.html';
  }

  // Construir la ruta del archivo
  const filePath = path.join(__dirname, '../public', urlPath);
  
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
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
    // Continuar a fallback
  }

  // Fallback a index.html para SPA
  try {
    const indexPath = path.join(__dirname, '../public/index.html');
    const content = fs.readFileSync(indexPath);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(content);
  } catch (e) {
    return res.status(404).json({ error: 'Not found' });
  }
}
