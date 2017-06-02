/**
 * Created by alex on 02.06.17.
 */

let mongoose = require("../db/connect");
let express = require("express");
let session = require("express-session");
let MongoStore = require("connect-mongo")(session);

let sessionStore = new MongoStore({mongooseConnection: mongoose.connection, collection: "sessions", adapter: "connect-mongo"});

module.exports = sessionStore;