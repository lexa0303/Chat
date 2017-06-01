/**
 * Created by lexa0 on 01.06.2017.
 */

let Log = require("../lib/log")(module);
let chat = require("../chat");


module.exports = function(server) {
    let io = require('socket.io')(server);

    io.set("logger", Log);

    io.sockets.on("connection", function (socket) {
        "use strict";
        socket.emit("news", {hello: "work"});
        socket.on("message", function (fields) {
            chat.publish(fields);
            socket.broadcast.emit("message", fields);
        })
    });
};
