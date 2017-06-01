/**
 * Created by alex on 29.05.17.
 */

let historyRepository = require("../repositories/history");
let clients = [];

exports.subscribe = (req,res) => {
    "use strict";
    clients.push(res);

    res.on("close", () => {
        clients.splice(clients.indexOf(res), 1);
    })
};

exports.publish = (fields) => {
    "use strict";

    fields.message = fields.message.pop();
    fields.message = fields.message.replace(/[\s]http:\/\/([\S]*)\.jpg/g, ' <img src="http://$1.jpg"/>');
    fields.message = fields.message.replace(/[\s]http:\/\/([\S]*)\.png/g, ' <img src="http://$1.png"/>');
    fields.message = fields.message.replace(/[\s]http:\/\/([\S]*)\.jpeg/g, ' <img src="http://$1.jpeg"/>');
    fields.message = fields.message.replace(/[\s]https:\/\/([\S]*)\.jpg/g, ' <img src="https://$1.jpg"/>');
    fields.message = fields.message.replace(/[\s]https:\/\/([\S]*)\.png/g, ' <img src="https://$1.png"/>');
    fields.message = fields.message.replace(/[\s]https:\/\/([\S]*)\.jpeg/g, ' <img src="https://$1.jpeg"/>');
    fields.message = fields.message.replace(/[\s]http:\/\/([\S]*)/g, ' <a target="_blank" href="https://$1">$1</a>');

    let data = {};
    data.message = fields.message;
    data.author = fields.user_name.pop();
    data.date = new Date();

    historyRepository.add(data);

    fields.date = data.date;
    fields.author = data.author;

    clients.forEach(function (res) {
        res.end(JSON.stringify(fields));
    });



    clients = [];
};

exports.history = (req, res) => {
    "use strict";

    let filter = {

    };

    let options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    historyRepository.get(filter, (err, data) => {
        res.end(JSON.stringify(data));
    });
};

// setInterval(()=>{
//     "use strict";
//     console.log(clients.length);
// }, 2000);