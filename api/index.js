import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base de datos
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

  // Servir archivos estáticos desde public/
  if (req.method === 'GET' && !req.url.startsWith('/api')) {
    const filePath = path.join(__dirname, '../public', req.url === '/' ? 'index.html' : req.url);
    
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        const mimeTypes = {
          '.html': 'text/html',
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
      // Fallback a index.html para SPA
      try {
        const indexPath = path.join(__dirname, '../public/index.html');
        const content = fs.readFileSync(indexPath);
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(content);
      } catch (e) {
        return res.status(404).json({ error: 'Not found' });
      }
    }
  }

  res.status(404).json({ error: 'Not found' });
}
