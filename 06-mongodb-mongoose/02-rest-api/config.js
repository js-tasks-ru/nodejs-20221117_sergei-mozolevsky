module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test') ?
      'mongodb://127.0.0.1/6-module-2-task' :
      'mongodb://127.0.0.1/any-shop',
  },
};
