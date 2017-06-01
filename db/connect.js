/**
 * Created by alex on 30.05.17.
 */

let mongoose = require('mongoose');
let config = require('../config');

mongoose.connect(config.get("db:uri"), config.get("db:opts"));

mongoose.set('debug', true);

this.connection = mongoose.connection;

mongoose.connection.on('connected', function() {
    this.state = 'connected to db';
    console.log(this.state);
});

mongoose.connection.on('error', function(err) {
    this.state = 'disconnected from db';
    console.log(this.state);
});

mongoose.connection.on('disconnected', function() {
    this.state = 'disconnected from db';
    console.log(this.state);
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        this.state = 'disconnected';
        process.exit(0);
    });
});

mongoose.connection.url = config.get("db:uri");

module.exports = mongoose;