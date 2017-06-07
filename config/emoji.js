/**
 * Created by alex on 07.06.17.
 */

let nconf = require("nconf");
let path = require("path");

nconf.argv()
    .env()
    .file("emoji", path.join(__dirname, 'emoji.json'));

module.exports = nconf;