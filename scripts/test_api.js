import app from '../api/index.js';

const server = app.listen(3000, async () => {
  console.log('Test server running on http://localhost:3000');

  try {
    // POST create
    const postRes = await globalThis.fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Test', email: 't@test.com', evento: 'E', categoria: 'vip' })
    });
    console.log('POST /api/tickets status', postRes.status);
    const postBody = await postRes.text();
    console.log('POST body:', postBody);

    // GET listar
    const listRes = await globalThis.fetch('http://localhost:3000/api/listar');
    console.log('GET /api/listar status', listRes.status);
    console.log('GET /api/listar body', await listRes.text());

    // parse ticket id/code from postBody if json
    let code;
    try { code = JSON.parse(postBody).codigo; } catch(e) { code = null; }
    if (code) {
      const getRes = await globalThis.fetch(`http://localhost:3000/api/ticket?codigo=${code}`);
      console.log('GET /api/ticket?codigo status', getRes.status);
      console.log('GET /api/ticket body', await getRes.text());
    }
  } catch (err) {
    console.error('Test error', err);
  } finally {
    server.close(() => console.log('Server closed'));
  }
});
