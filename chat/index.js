/**
 * Created by alex on 29.05.17.
 */

let historyRepository = require("../repositories/history");
let clients = [];
const emoji = require("node-emoji");

let chat = function(){
    "use strict";


};

chat.prototype.onConnect = function(user, callback){
    "use strict";


};

chat.prototype.subscribe = function(req,res) {
    "use strict";
    clients.push(res);

    res.on("close", () => {
        clients.splice(clients.indexOf(res), 1);
    })
};

chat.prototype.publish =  function(fields, user, callback) {
    "use strict";

    // fields.message = fields.message.replace(/[\s]http:\/\/([\S]*)\.jpg/g, ' <img src="http://$1.jpg"/>');
    // fields.message = fields.message.replace(/[\s]http:\/\/([\S]*)\.png/g, ' <img src="http://$1.png"/>');
    // fields.message = fields.message.replace(/[\s]http:\/\/([\S]*)\.jpeg/g, ' <img src="http://$1.jpeg"/>');
    // fields.message = fields.message.replace(/[\s]https:\/\/([\S]*)\.jpg/g, ' <img src="https://$1.jpg"/>');
    // fields.message = fields.message.replace(/[\s]https:\/\/([\S]*)\.png/g, ' <img src="https://$1.png"/>');
    // fields.message = fields.message.replace(/[\s]https:\/\/([\S]*)\.jpeg/g, ' <img src="https://$1.jpeg"/>');
    // fields.message = fields.message.replace(/[\s]http:\/\/([\S]*)/g, ' <a target="_blank" href="https://$1">$1</a>');

    let data = {};
    data.message = fields.message;
    data.author = user.login;
    data.date = new Date();

    historyRepository.add(data);

    callback(data);
};

chat.prototype.history = function(req, res) {
    "use strict";

    let filter = {

    };

    let offset = req.body.offset;

    let options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    historyRepository.get(filter, {date:-1}, 20, offset, (err, data) => {
        res.end(JSON.stringify(data));
    });
};

module.exports = new chat;

// setInterval(()=>{
//     "use strict";
//     console.log(clients.length);
// }, 2000);