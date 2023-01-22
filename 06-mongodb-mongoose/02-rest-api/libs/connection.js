const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('../config');

mongoose.plugin(beautifyUnique);

module.exports = mongoose.createConnection(config.mongodb.uri, err => {
    if (err) {
        console.error(err)
    } else {
        console.log('Mongo DB is connected')
    }
});
