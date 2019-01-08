const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost/metasong';

module.exports = function() {
    mongoose.Promise = global.Promise;

    try {
        mongoose.connect(DB_URL);
    } catch (err) {
        mongoose.createConnection(DB_URL);
    }

    mongoose.connection
        .once('open', () => console.log('MongoDB is running.'))
        .on('error', e => {
            throw e;
        });
};