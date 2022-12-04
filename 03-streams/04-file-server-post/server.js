const url = require('node:url');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { access, mkdir, unlink } = require('node:fs/promises');
const LimitSizeStream = require('./LimitSizeStream');
const { pipeline } = require('stream');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  const folderPath = path.join(__dirname, 'files');

  switch (req.method) {
    case 'POST':

    if (pathname.includes('/')) {
      res.statusCode = 400;
      res.end('Nested paths are not supported');
      break;
    }

    access(folderPath)
      .catch(err => mkdir(folderPath))
      .then(() => access(filepath))
      .then(() => {
        res.statusCode = 409;
        res.end('Such file is already exists on the server');
      })
      .catch(err => {
        
        const writeFile = fs.createWriteStream(filepath);
        const limitSizeStream = new LimitSizeStream({limit: 1000000})

        pipeline(req, limitSizeStream, writeFile, err => {
          if (err) {
            const {code, message} = err;

            switch (code) {
              case 'LIMIT_EXCEEDED':
                  unlink(filepath)
                  res.statusCode = 413;
                  res.end(`Error: ${code}. Supported files <1Mb`);
                break;
              case 'ECONNRESET':
                  unlink(filepath)
                break;
              default:
                  res.statusCode = 500;
                  res.end(`Server error: ${code} ${message}`);
                break;
            }

          } else {
            res.statusCode = 201;
            res.end('File was successfully loaded')
          }
        })
      })
    break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
