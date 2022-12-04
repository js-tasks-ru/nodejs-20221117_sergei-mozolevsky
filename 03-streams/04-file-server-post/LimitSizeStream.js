const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor({limit, encoding}) {
    super({limit, encoding});

    this.limit = limit;
    this.encoding = encoding;
    this.size = 0;
  }

  _transform(chunk, encoding, callback) {
    const chunkStr = chunk.toString();
    const chunkSize = Buffer.byteLength(chunk, this.encoding)

    this.size = this.size + chunkSize;

    if (this.size <= this.limit) {
      callback(null, chunkStr)
    } else {
      this.size = 0;
      callback(new LimitExceededError())
    }
  }
}

module.exports = LimitSizeStream;
