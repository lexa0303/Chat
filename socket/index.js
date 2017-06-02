/**
 * Created by lexa0 on 01.06.2017.
 */

let Log = require("../lib/log")(module);
let chat = require("../chat");
let cookie = require("cookie");
let config = require("../config");
let cookieParser = require("cookie-parser");
let sessionStore = require("../lib/sessionStore");
let Users = require("../repositories/user");


module.exports = function(server) {
    let io = require('socket.io')(server);

    io.set("logger", Log);

    io.use(function(socket, callback){
        "use strict";

        let handshake = socket.request;

        handshake.cookies = cookie.parse(handshake.headers.cookie || "");
        let sidCookie = handshake.cookies[config.get("session:key")];
        let sid = cookieParser.signedCookie(sidCookie, config.get("session:secret"));

        sessionStore.load(sid, function(err, session){
             if (err) throw new Error(err);

             if (!session) throw new Error(401, "No session");

             handshake.session = session;

             if (!session.user){
                 return null;
             }

             Users.getById(session.user, function(err, user){
                 if (err) throw new Error(err);

                 if (!user) {
                     callback(null, false);
                     throw new Error(403);
                 }

                 handshake.user = user;

                 // console.log(handshake);

                 callback(null, true);
             })
        });
    });

    io.sockets.on("connection", function (socket) {
        "use strict";

        let user = socket.request.user;

        socket.broadcast.emit("join", user.login);

        socket.on("message", function (fields) {
            chat.publish(fields, user, function(result){
                socket.broadcast.emit("message", result);
                socket.emit("message", result);
            });
        });

        socket.on("disconnect", function(){
            socket.broadcast.emit("leave", user.login);
        })
    });
};
