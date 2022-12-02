const url = require('node:url');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { access } = require('node:fs/promises');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  // Temp file path just for tests
  // const filepath = path.join(__dirname, 'test', 'fixtures', pathname);

  switch (req.method) {
    case 'GET':

    if (pathname.includes('/')) {
      res.statusCode = 400;
      res.end('Nested paths are not supported');
      break;
    }

    try {
      await access(filepath)
    } catch ({name, message}) {
      res.statusCode = 404;
      res.end(`File by path ${pathname} does not exist. Error: ${name}`)
    }

    const stream = fs.createReadStream(filepath);

    stream.on('error', ({name, message}) => {
      res.statusCode = 500;
      res.end(`Error: ${name}: ${message}. :()`)
    })

    res.on('close', () => {
      console.log('network died')
      stream.destroy();
    })

    res.statusCode = 200;
    stream.pipe(res);
    break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
