let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let fs = require("fs");
let session = require("express-session");
let MongoStore = require("connect-mongo")(session);
const compression = require('compression');
var minify = require('express-minify');

let functions = require("./functions");
let config = require("./config");
let mongoose = require('./db/connect');
let Log = require("./lib/log")(module);

let index = require('./routes/index');
let users = require('./routes/users');
let chatRoute = require('./routes/chat');
let loginRoute = require('./routes/login');
let logoutRoute = require('./routes/logout');
let personalRoute = require('./routes/personal');

let app = express();

// view engine setup
app.engine("ejs", require("ejs-locals"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(minify({
    cache: './cache',
    uglifyJS: undefined,
    cssmin: undefined,
    onerror: undefined,
    js_match: /(.*).js/,
    css_match: /(.*).css/,
    sass_match: /scss/,
    less_match: /less/,
    stylus_match: /stylus/,
    coffee_match: /coffeescript/,
    json_match: /json/
}));
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
    maxage: '3600000'
}));

let sessionStore = require("./lib/sessionStore");

app.use(session({
    secret: config.get("session:secret"),
    key: config.get("session:key"),
    cookie: config.get("session:cookie"),
    store: sessionStore
}));

app.use(function(req, res, next){
    "use strict";
    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
    next();
});

app.use(require("./middleware/loaduser"));
app.use(require("./middleware/checkAuth"));

let server = require('http').createServer(app);
let io = require("./socket")(server);
app.set("io", io);

app.use('/', index);
app.use('/users', users);
app.use('/chat', chatRoute);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/personal", personalRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err.message);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(process.env.PORT || config.get("port"));

module.exports = app;
