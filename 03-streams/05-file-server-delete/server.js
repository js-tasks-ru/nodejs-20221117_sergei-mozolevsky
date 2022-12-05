const http = require('node:http');
const path = require('node:path');
const { access, unlink } = require('node:fs/promises');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
  
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested paths are not supported');
        return;
      }

      try {
        await access(filepath)
        await unlink(filepath)

        res.statusCode = 200;
        res.end(`File ${pathname} was removed`)

      } catch ({code, message}) {
        res.statusCode = code === 'ENOENT' ? 404 : 500;
        res.end(`Something went wrong. Error code: ${code}. Message: ${message}`)
      }

    break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
