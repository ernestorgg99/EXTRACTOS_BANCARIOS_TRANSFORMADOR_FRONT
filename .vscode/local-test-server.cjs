const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

const frontend = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const requestedPath = pathname === '/' ? 'index.html' : pathname.slice(1);
    const filePath = path.resolve(root, requestedPath);

    if (!filePath.startsWith(`${root}${path.sep}`)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
        res.end(content);
    });
});

const mockApi = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    if (req.method !== 'POST' || req.url !== '/api/check_duplicates') {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const { movements } = JSON.parse(body);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            // Mock local: devuelve lo recibido sin consultar ni modificar una base de datos.
            res.end(JSON.stringify({ processed_extract: movements }));
        } catch {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Invalid JSON request' }));
        }
    });
});

frontend.listen(8000, '127.0.0.1', () => console.log('Frontend: http://127.0.0.1:8000'));
mockApi.listen(5001, '127.0.0.1', () => console.log('API simulada local: http://127.0.0.1:5001 (sin acceso al backend real)'));
